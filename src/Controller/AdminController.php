<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewUserFormType;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\SearchType;
use App\Repository\UserRepository;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

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
        $filesystem = new Filesystem();
        try {
            $filesystem->mkdir('fichier/logs');
//             $filesystem->dumpFile('fichier/logs/logs.txt','User control,'."\n");
            $fileExist = $filesystem->exists('fichier/logs/logs.txt');
            if($fileExist)
            {
                $filesystem->appendToFile('fichier/logs/logs.txt',$this->getUser()->getEmail().'; UserControl; '.(new \DateTime())->format('y-m-d h:i:s')."\n");
            }
        }catch(Exception $e){
            dd('catch(Exception $e){');
        }

//         dd($fileExist);
        return $this->render('admin/userControl.html.twig', [
            
        ]);
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = FORMULAIRE NOUVEAU COMPTE = = = = = = = = = = = =//
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin/controlUser/newUser", name="admin_UserControl_newUser")
     */
    public function NewUser(Request $request, EntityManagerInterface $em)
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
            $this->addFlash('success', 'Compte enregistré !');
            return $this->redirectToRoute('admin_UserControl');                                                   //On retourne soit à l'acceuil ou soit sur la page Admin
        }
        return $this->render('admin/newUser.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = RECHERCHER UTILISATEUR = = = = = = = = = = = = = //
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin/controlUser/searchUser", name="admin_UserControl_searchUser")
     */
    public function SearchUser(Request $request, UserRepository $userRepository)
    {
        $form = $this->createFormBuilder()
        ->add('Recherche', SearchType::class, ['required' =>false])
        ->getForm();
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid())
        {
            
            $resultat =$form->getData()['Recherche'];
            $rechercheResultatsNom = $userRepository->loadByElementBegin('Nom',$resultat);                      //Les trois lignes sont des requêtes personnalisées
            $rechercheResultatsPrenom = $userRepository->loadByElementBegin('prenom',$resultat);                //Elles récupèrent tout les champs commencant par
            $rechercheResultats = [];
            $testPositif = 0;
            foreach($rechercheResultatsNom as $recherche)
            {
                $rechercheResultats[] = $recherche;
            }
            foreach($rechercheResultatsPrenom as $recherche)
            {
                foreach($rechercheResultats as $compareId)
                {
                    if($recherche->getId() == $compareId->getId())
                    {
                       $testPositif = 1;
                    }
                } 
                $testPositif ? $testPositif =0 : $rechercheResultats[] = $recherche;
                
            }
//             if(!$rechercheResultats)
//             {
//                 goto listeUser;
//             }
            if(!$resultat || !$rechercheResultats)
            {
               // listeUser:
                $rechercheResultats = $userRepository->findAll(); 
            }
            return $this->render('admin/searchUser.html.twig', ['form' => $form->createView(), 'rechercheResultat' => $rechercheResultats]);
        }
        return $this->render('admin/searchUser.html.twig', ['form' => $form->createView(), 'rechercheResultat' => $userRepository->findAll()/*$userRepository->loadByAlphaOrder()*/]);
    }
    /**
     *@Route("/admin/controlUser/searchUser/{id}", name="admin_UserControl_searchUser_id")
     */
    //Dans ce controller On peut Editier les Infos nom, prénom, email de l'utilisateur, on peut aussi
    //modifier le rôle de l'utilisateur en question. Enfin on peut également supprimer l'utilisateur.
    public function EditionUser($id, UserRepository $uR, Request $request, EntityManagerInterface $em, TokenStorageInterface $tokenStorage)
    {
        $userToModify = $uR->findOneBy(['id' => $id]);                                  //Récupération de l'utiisateur à modifier
        $form = $this->createForm(NewUserFormType::class, $userToModify);               //Création formulaire avec les infos
        $formRoles = $this->createFormBuilder()                                         //Création formulaire pour les roles (A améliorer)
        ->add('Roles', ChoiceType::class,                                               //On ajoute une entrée 'choix' pour les rôles
            ['choices' => ['Administrateur' => 'Admin', 'Utilisateur' => 'ROLE_USER'],
             'placeholder' => 'Choisir un rôle'
            ])
        ->getForm();
        $formDelete =$this->createFormBuilder()
        ->getForm();
        $form->handleRequest($request);                                                 //On récupère les requêtes du premier form   
        if($form->isSubmitted() && $form->isValid())        
        { 
            $userToModify = $form->getData();                                           //On fait les changements puis on enregistre
            $em->persist($userToModify);
            $em->flush();      
        }
        $formDelete->handleRequest($request);                                            //On récupère les requêtes du deuxieme form
        if( $formDelete->isSubmitted() &&  $formDelete->isValid())
        {  
            //Deconnecter l'utilisateur avant de supprimer son compte
            if($this->getUser() == $userToModify)
            {
                $this->addFlash('danger','Il est impossible à un administrateur de supprimer son propre compte !');
                return $this->redirectToRoute('admin_UserControl_searchUser');
            }else
            {
                $em->remove($userToModify);
                $em->flush();
                $this->addFlash('success','Compte bien supprimé');
                return $this->redirectToRoute('admin_UserControl_searchUser');
            }
        }
        $formRoles->handleRequest($request);                                            //On récupère les requêtes du deuxieme form
        if($formRoles->isSubmitted() && $formRoles->isValid())
        {
            //Essayer de changer la méthode depuis le choiceType
            if($formRoles->getData()['Roles'] == 'Admin')//Choix Admin                  //On fait les changements puis on enregistre
            {
                $userToModify->setRoles(['ROLE_ADMIN','ROLE_USER']);                    //On met le role admin + user
            }
            else
            {
                $userToModify->setRoles([$formRoles->getData()['Roles']]);              //Uniquement role user
            }
            $em->persist($userToModify);
            $em->flush();
            $this->addFlash('success','Changement de droits bien effectué !');
            return $this->redirect($request->getUri());
        }
        return $this->render('admin/editionUser.html.twig',
            [   'user' => $userToModify,
                'form' => $form->createView(),
                'formRoles' => $formRoles->createView(),
                'formDelete' => $formDelete->createView()
            ]);
    }
    //////////////////////////////////////////////////////////////////////////
    // = = = = = = = = = = RECHERCHER UTILISATEUR = = = = = = = = = = = = = //
    //////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/admin/controlUser/logs", name="admin_UserControl_Logs")
     */
    public function Logs()
    {
        
        return $this->render('admin/logs.html.twig');
    }
    
}
