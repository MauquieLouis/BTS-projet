<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewMachineFormType;
use App\Entity\Machine;
use Doctrine\ORM\EntityManagerInterface;

class MachineController extends AbstractController
{
    /**
     * @Route("/machine", name="machine")
     */
    public function index(EntityManagerInterface $em)
    {
        
        $repository = $em->getRepository(Machine::class);
  
        $machines = $repository->findAll();
        
        
        $machine = new Machine();
        $formMachine = $this->createForm(NewMachineFormType::class, $machine);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        
        return $this->render('machine/index.html.twig', [
            'formMachine' => $formMachine->createView(),
            'controller_name' => 'MachineController',
            'Machines' => $machines,
        ]);
    }
    
    /**
     * @Route("/modele/{slug}", name="modele3D")
     */
    public function viewModele($slug, EntityManagerInterface $em)
    {
        $repository = $em->getRepository(Machine::class);
        /** @var Blog $article */
        $machine = $repository->findOneBy(['id'=> $slug]);
        
        if(!$machine)
        {
            throw $this->createNotFoundException(sprintf('No machine for slug "%s"', $slug));
        }
        
        return $this->render('machine/viewmodel.html.twig', [
            'controller_name' => 'MachineController',
            'machine' => $machine,
        ]);
    }
}
