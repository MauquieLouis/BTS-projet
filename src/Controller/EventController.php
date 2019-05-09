<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
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
    public function NewEvent(Request $request)
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
            switch($formEvent->getData()['MesureTemps'])
            {
            case "J":
                $event->setFrequence($formEvent->getData()['frequence'].$formEvent->getData()['MesureTemps']);
                break;
            case "S":
                break;
            case "M":
                break;
            case "A":
                break;
            default:
                dd("Error Switch :  '$'"."formEvent['MesureTemps'] in EventController.php -> public function NewEvent");
                break;
            }
            $event->setTitle($formEvent->getData()['title']);
            $event->setDescription($formEvent->getData()['description']);
            $event->setDateStart($formEvent->getData()['dateStart']);
            $event->setUsersid($userIdTable);
            $event->setMachinesid($machineIdTable);
            dump('Form',$formEvent->getData(), $event);
            dd('FIN');
            return $this->redirectToRoute('event');
        }
        return $this->render('event/newEvent.html.twig', [
            'formEvent' => $formEvent->createView(),
            'controller_name' => 'EventController',
        ]);
    }
}
