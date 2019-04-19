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
        $formEvent = $this->createForm(NewEventFormType::class, $event);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        $formEvent->handleRequest($request);
        if($formEvent->isSubmitted() && $formEvent->isValid())
        {
            foreach($event->getUsersid() as $user)                  //parcour du tableau des utilisateurs
            {
                $userIn = $user['user'];
                if($userIn) 
                {
                    $userIdTable[]=$userIn->getId();                //Création d'un tableau avec les id des utilisateurs retournés.
                }
            }
            $event->setUsersid($userIdTable);
            dd('Form', $event);
        }
        return $this->render('event/newEvent.html.twig', [
            'formEvent' => $formEvent->createView(),
            'controller_name' => 'EventController',
        ]);
    }
}
