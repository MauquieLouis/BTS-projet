<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewMachineFormType;
use App\Entity\Machine;
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
        ->add('imagefilename', TextType::class,array('attr' => array('maxlength' =>15))) //Pour un maximum de 15 caract�res
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
