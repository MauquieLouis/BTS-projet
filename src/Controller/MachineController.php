<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewMachineFormType;
use App\Entity\Machine;

class MachineController extends AbstractController
{
    /**
     * @Route("/machine", name="machine")
     */
    public function index()
    {
        $machine = new Machine();
        $formMachine = $this->createForm(NewMachineFormType::class, $machine);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        
        return $this->render('machine/index.html.twig', [
            'formMachine' => $formMachine->createView(),
            'controller_name' => 'MachineController',
        ]);
    }
    
    /**
     * @Route("/modele", name="modele3D")
     */
    public function viewModel()
    {

        return $this->render('machine/viewmodel.html.twig', [
            'controller_name' => 'MachineController',
        ]);
    }
}
