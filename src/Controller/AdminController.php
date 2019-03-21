<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewUserFormType;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\ORM\EntityManagerInterface;

class AdminController extends AbstractController
{
    private $passwordEncoder;
    
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = ACCEUIL DE LA SECTION ADMIN = = = = = = = = = = =//
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        return $this->render('admin/index.html.twig', [

        ]);
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = PAGE GESTION DES COMPTES  = = = = = = = = = = = =//
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin/controlUser", name="admin_UserControl")
     */
    public function UserControl()
    {
        return $this->render('admin/userControl.html.twig', [
            
        ]);
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = FORMULAIRE NOUVEAU COMPTE = = = = = = = = = = = =//
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin/controlUser/newUser", name="admin_UserControl_newUser")
     */
    public function newUser(Request $request, EntityManagerInterface $em)
    {
        $user = new User();                                         //Création d'un nouvel objet Utilisateur
        $form = $this->createForm(NewUserFormType::class, $user);   //Création d'un nouvel objet formulaire agissant sur le nouvel utilisateur créé auparavant
        $form->handleRequest($request);                             //Attente d'une requête du formulaire, la fonction handleRequest()permet de reconnaitre si le formulaire est validé ou non (requête renvoyé au controller qui créer le formulaire)
        if($form->isSubmitted() && $form->isValid())                //Si les données du formulaire sont remplies et correctes On valide la création puis ajoute les derniers champs manquant, puis on insère dans la base de donnée
        {               
            $user->setDatecreation(new \DateTime());                                                 //Ajout de la date de création du compte à la date actuelle
            $user->setPassword($this->passwordEncoder->encodePassword($user,$user->getNom()));       //Le premier Mdp est le NOM de l'utilisateur, il faudrat le changer à la première connexion  
            $em->persist($user);                                                                     //On ajoute à la base de données
            $em->flush();
            // = = = = =  A J O U T E R   M E S S A G E   C O N F I R M A T I O N   C R E A T I O N   C O M P T E = = = = =//
            return $this->redirectToRoute('Home');                                                   //On retourne soit à l'acceuil ou soit sur la page Admin             
        }  
        return $this->render('admin/newUser.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}