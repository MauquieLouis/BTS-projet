<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\NewEventFormType;
use App\Entity\Event;

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
        if($formEvent->isSubmitted() && $formEvent->isValid())
        {
            //------------------------T A B L E A U   I D   U S E R S -------------------------//
            foreach($formEvent->getData()['usersid'] as $user)                  //parcour du tableau des utilisateurs
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
            $event->setUsersid($userIdTable);
            $event->setMachinesid($machineIdTable);
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
    