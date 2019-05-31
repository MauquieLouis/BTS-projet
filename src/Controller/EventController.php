<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\SearchType;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\NewEventFormType;
use App\Entity\Event;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use App\Repository\MachineRepository;
use App\Repository\ModeleMachineRepository;
use Knp\Component\Pager\PaginatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;


/**
 *  @IsGranted("ROLE_ADMIN")
 */
class EventController extends AbstractController
{
    /**
     * @Route("/event", name="event")
     */
    public function index()
    {   
        return $this->render('event/index.html.twig', [
        ]);
    }
    /**
     * @Route("/event/nouveau", name="event_noveau")
     */
    public function NewEvent(Request $request, EntityManagerInterface $em)
    {
        $event = new Event();
        $formEvent = $this->createForm(NewEventFormType::class);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        $formEvent->handleRequest($request);
        $userIdTable = null;
        $machineIdTable = null;
        if($formEvent->isSubmitted() && $formEvent->isValid())
        {
            //------------------------T A B L E A U   I D   U S E R S -------------------------//
            foreach($formEvent->getData()['usersid'] as $user)      //parcour du tableau des utilisateurs
            {
                $userIn = $user['user'];                            //Recupere l'user
                if($userIn)                                         //Si il existe
                {
                    $userIdTable[]=$userIn->getId();                //Création d'un tableau avec les id des utilisateurs retournés.
                }
            }
            //------------------------T A B L E A U   I D   M A C H I N E S  -------------------------//
            foreach($formEvent->getData()['machinesid'] as $key=>$machine)
            {
                $machineIdTable[] = $machine["machinesDispo"];
            }
            //------------------------ D A T E   E N D   E T   F R E Q U E N C E ---------------------//
            $dateDebut = $formEvent->getData()['dateStart'];
            
            $event->setDateStart($formEvent->getData()['dateStart']);
            $dateFin = $this->ModifyDate($formEvent->getData()['dateStart'], $formEvent->getData()['frequence'], $formEvent->getData()['MesureTemps']);
            $event->setDateEnd($dateFin);
            $event->setTitle($formEvent->getData()['title']);
            $event->setDescription($formEvent->getData()['description']);
            if($userIdTable)
            {
                $event->setUsersid($userIdTable);
            }
            if($machineIdTable)
            {
                $event->setMachinesid($machineIdTable);
            }
            
            $event->setFrequence($formEvent->getData()['frequence'].$formEvent->getData()['MesureTemps']);
            dump('Form',$formEvent->getData(), $event);
//             dd('FIN');
            $em->persist($event);
            $em->flush();
            return $this->redirectToRoute('event');
        }
        return $this->render('event/newEvent.html.twig', [
            'formEvent' => $formEvent->createView(),
            'controller_name' => 'EventController',
        ]);
    }
    /**
     * @Route("/event/displayEvent/{id}", name="event_Display")
     */
    public function DisplayEvent($id, EventRepository $eR, UserRepository $uR, MachineRepository $mR, ModeleMachineRepository $mMR)
    {
        $event = $eR->findOneBy(['id' => $id]);
        foreach($event->getUsersid() as $userId)
        {
            $tableUser[] = $uR->findOneBy(['id' => $userId]); 
            
        }
        foreach($event->getMachinesid() as $key=>$machinesId)
        {
            $tableMachine[$key][0] = $mR->findOneBy(['id' => $machinesId]);
            $tableMachine[$key][1] = $mMR->findOneBy(['id' => $tableMachine[$key][0]->getModele()->getId()]);
        }
//         dd($tableMachine);
        return $this->render('event/infoEvent.html.twig', [
            'event' => $event,
            'tableUser' => $tableUser,
            'tableMachine' => $tableMachine
        ]);
    }
    /**
     * @Route("/event/searchListe", name="event_searchListe")
     */
    public function SearchListe(Request $request, PaginatorInterface $paginator, EventRepository $eR)
    {
        $form = $this->createFormBuilder()
        ->add('Recherche', SearchType::class, ['required' =>false])
        ->getForm();
        
        $q = $request->query->get('q');
        
        $queryBuilder = $eR->getAllByDate($q);
        
        $pagination = $paginator->paginate(
            $queryBuilder,
            $request->query->getInt('page',1),
            10
            );
        
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid())
        {
            
        }
        
        return $this->render('event/listeEvent.html.twig', [
            'form' => $form->createView(),
            'pagination' => $pagination,
        ]);
    }
    
   
   private function ModifyDate($date, $frequence, $mesure)
    {
        
        $date = $date->format('Y-m-d');
//         dump($date);
        $datemodifie = new \DateTime($date);
        switch ($mesure)
        {
            case "d":
                $datemodifie = $datemodifie->modify('+'.$frequence.' day');
                break;
            case "w":
                $datemodifie = $datemodifie->modify('+'.$frequence.' week');
                break;
            case "m":
                $datemodifie = $datemodifie->modify('+'.$frequence.' month');
                break;
            case "y":
                $datemodifie = $datemodifie->modify('+'.$frequence.' year');
                break;
            default:
                dd("Error Switch :  private function ModifyDate($"."date, $"."frequence, $"."mesure)");
                break;
        }
//         $datemodifie = $datemodifie->modify('+'.$frequence.'days');
        return $datemodifie;
    }
}
    