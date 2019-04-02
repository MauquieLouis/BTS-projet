<?php

namespace App\Controller;

use App\Entity\Machine;
use App\Entity\Maintenance;
use App\Entity\Etapes;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewMachineFormType;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Driver\Connection;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
 
class MachineController extends AbstractController
{
    protected $data;
    
    public function setData($data)
    {
        $this->data = $data;
    }
    public function getData()
    {
        return $this->data;
    }
    /**
     * @Route("/machine", name="machine")
     */
    public function index(Request $request, EntityManagerInterface $em)
    {
//      Recuperation de toutes les machines existantes ////////////////
        $repository = $em->getRepository(Machine::class);
        $machines = $repository->findAll();
///////////////////////////////////////////////////////////////////////        
        
        $machine = new Machine();
//         $formMachine = $this->createForm(NewMachineFormType::class, $machine);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        $formMachine = $this->createFormBuilder($machine)     //creation du formulaire
        ->add('name', TextType::class)
        ->add('description', TextareaType::class)
        ->add('imagefilename', TextType::class,array('attr' => array('maxlength' =>255))) //Pour un maximum de 255 caract�res
        ->add('Enregistrer', SubmitType::class,  array('label' =>'Save Machine'))
        ->getForm();
        $formMachine->handleRequest($request);
        
        if (($formMachine->getClickedButton() && 'Enregistrer' === $formMachine->getClickedButton()->getName())) //BOUTON SAUVEGARDER + APERCU
        {
            $blog = $formMachine->getData();
            $this->setData($blog);
            $em->persist($blog);        //Pour ajouter � la base de donn�e
            $em->flush();
            $request = 0;
            return $this->render('home/index.html.twig',);
        }
        return $this->render('machine/index.html.twig', [
            'formMachine' => $formMachine->createView(),
            'controller_name' => 'MachineController',
            'Machines' => $machines,
        ]);
    }
    
    /**
     * @Route("/maintenance/{machine}", name="maintenanceModele3D")
     */
    public function viewMaintenances($machine, EntityManagerInterface $em, Request $request)
    {
       $repositoryMaintenance = $em->getRepository(Maintenance::class);
       $repositoryMachine = $em->getRepository(Machine::class);
       $maintenances = $repositoryMaintenance->findBy(['idMachine'=> $repositoryMachine->findOneById(['id'=>$machine])
       ]);
       
       
       
       $machinegetID = $em->getRepository(Machine::class)->findOneBy(['id'=> $machine]);
//         if(!$maintenance)
//         {
//             throw $this->createNotFoundException(sprintf('No maintenance for machine "%s"', $machine));
//         }
//////// CREATION FORMULAIRE D UNE MAINTENANCE     /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $maintenance = new Maintenance();
        $FormMaintenance = $this->createFormBuilder($maintenance)     //creation du formulaire
        ->add('nom', TextType::class)
        ->add('Enregistrer', SubmitType::class,  array('label' =>'Save Maintenance'))
        ->getForm();
        $FormMaintenance->handleRequest($request);
        
        if (($FormMaintenance->getClickedButton() && 'Enregistrer' === $FormMaintenance->getClickedButton()->getName())) //BOUTON SAUVEGARDER + APERCU
        {
            $createMaintenance = $FormMaintenance->getData();
            $this->setData($createMaintenance);
            $createMaintenance->setIdMachine($machinegetID);
            $em->persist($createMaintenance);        //Pour ajouter � la base de donn�e
            $em->flush();
            $request = 0;
            return $this->render('home/index.html.twig',);
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        return $this->render('machine/maintenance.html.twig', [
            'controller_name' => 'MachineController',
            'formMaintenance' => $FormMaintenance->createView(),
            'maintenances' => $maintenances,
        ]);
    }
    
    /**
     * @Route("/modele/{slug}", name="modele3D")
     */
    public function viewModele($slug, EntityManagerInterface $em)
    {
        $repositoryMachine = $em->getRepository(Machine::class);
        $repositoryMaintenance = $em->getRepository(Maintenance::class);
        
        //$machine = $repositoryMachine->findOneBy(['id'=> $slug]);
        $machine = $repositoryMachine->findOneBy(['id'=>  $repositoryMaintenance->findOneBy(['id' =>$slug])->getIdMachine()
        ]);
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
