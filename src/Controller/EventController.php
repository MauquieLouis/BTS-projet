<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\SearchType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\NewEventFormType;
use App\Entity\Event;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use App\Repository\MachineRepository;
use App\Repository\MaintenanceRepository;
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
     * @Route("/event/complete/{id}", name="completeEvent")
     */
    public function completeEvent(Event $event, Request $request, EntityManagerInterface $em){
        $form = $this->createFormBuilder()
        ->add('Commentaire' ,TextareaType::class)->getForm();
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()){
            $event2 = new Event();
            $event2 = $event;
            $event2->setValid(true);
            
            $frequence = $event->getFrequence();
            $mesure = preg_replace('~[0-9]~', '', $frequence);
            $frequence = preg_replace('~\D~', '', $frequence);
            $date = new \DateTime();
            $nextDate = $this->ModifyDate($date, $frequence, $mesure);
            
            $event->setDateStart($nextDate);
            $event->setDescription($form->getData()['Commentaire']);
            $event2->setDateEnd($date);
            $em->persist($event);
            $em->persist($event2);
            $em->flush();
            $this->addFlash('info', 'Maintenace Compl�t�e');
            return $this->redirectToRoute('home');
        }
        return $this->render('event/completeEvent.html.twig', ['form'=>$form->createView()]);
    }
    /**
     * @Route("/event/{id}/delete", name="event_delete")
     */
    public function DeleteEvent($id, Event $event, EntityManagerInterface $em, EventRepository $eR)
    {
        $eventDelete = $eR->findOneBy(['id' => $id]);
        //dd($event);
        $em->remove($eventDelete);
        $em->flush();
        $this->addFlash('warning','Événement supprimé !');
        return $this->redirectToRoute('event_searchListe');
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
                $machineIdTable[$key]["machine"] = $machine["machinesDispo"];
                $machineIdTable[$key]["maintenance"] = $machine["maintenancesDispo"];
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
            //dd($formEvent->getData());
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
    public function DisplayEvent($id, EventRepository $eR, UserRepository $uR, MachineRepository $mR, ModeleMachineRepository $mMR, MaintenanceRepository $maintenanceR)
    {
        $event = $eR->findOneBy(['id' => $id]);
        foreach($event->getUsersid() as $userId)
        {
            $tableUser[] = $uR->findOneBy(['id' => $userId]); 
            
        }
        $tableMachine = null;
        if($event->getMachinesid() != null)
        {
            foreach($event->getMachinesid() as $key=>$machinesId)
            {
                //dd($machinesId);
                $tableMachine[$key]["machine"] = $mR->findOneBy(['id' => $machinesId["machine"]]);
                $tableMachine[$key]["modeleMachine"] = $mMR->findOneBy(['id' => $tableMachine[$key]["machine"]->getModele()->getId()]);
                $tableMachine[$key]["maintenance"] = $maintenanceR->findOneBy(['id' => $machinesId["maintenance"]]);
                //dd($tableMachine[$key]["maintenance"]);
            }
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
    
    private function ModifyDate($date, $frequence, $mesure){
       $date = $date->format('Y-m-d');

       $datemodifie = new \DateTime($date);
      
       switch($unit){
           case 'd':
               $frequence.= ' day';
               break;
           case 'w':
               $frequence .=' week';
               break;
           case 'm':
               $frequence.= ' month';
               break;
           case 'y':
               $frequence .= ' year';
               break;
           default:
               dd("Error Switch :  private function ModifyDate($"."date, $"."frequence, $"."mesure)");
               break;
       }
      
       $datemodifie = $datemodifie->modify('+'.$frequence);
      // dd($date);
       return $datemodifie;
       
    }
}
    