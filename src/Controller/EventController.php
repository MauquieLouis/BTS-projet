<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        $event = new Event();
        $formEvent = $this->createForm(NewEventFormType::class, $event);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
 
        return $this->render('event/index.html.twig', [
            'formEvent' => $formEvent->createView(),
            'controller_name' => 'EventController',
        ]);
    } 
} 