<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Form\ChangePasswordFormType;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;


class SecurityController extends AbstractController
{
    private $passwordEncoder;
    private $tokenStorage;
    private $session;
    
    public function __construct(UserPasswordEncoderInterface $passwordEncoder,
        TokenStorageInterface $tokens,
        SessionInterface $session
        )
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->tokenStorage = $tokens;
        $this->session = $session;
    }
    /**
     * @Route("/connexion", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        
        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }
    /**
     * @Route("/logout", name = "app_logout")
     */
    public function logout()
    {
        throw new \Exception('Will be intercepted before getting here');
    }
    /**
     * @Route("/premiere",name="isFirstConnection")
     *
     */
    public function isFirstConnection()                         //Function pour tester si l'utilisateur se connecte pour la première fois
    {
        //dd($this->getUser()->getRoles());
        if($this->getUser()->getRoles() == ['ROLE_NOUVEAU'])   //Si l'utilisateur à le rôle ROLE_NOUVEAU il ne s'est encore jamais connecté
        {
            return $this->redirectToRoute('change_mdp', [ 'info' => "Première Connexion"]);
        }
        return $this->redirectToRoute('Home');
    }
    /**
     * @Route("/premiere/ChangeMdp", name="change_mdp")
     */
    public function ChangeMdp(Request $request, EntityManagerInterface $em, UserInterface $user, TokenGeneratorInterface $tokenGenerator)
    {
        $user = $this->getUser();
        $form = $this->createForm(ChangePasswordFormType::class);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid())
        {
            $ispasswordValid = $this->passwordEncoder->isPasswordValid($user ,$form->getData()['oldPassword'] );
            if($ispasswordValid)    //Si le champs ancien mot de passe du formulaire correspond bien au mot de passe de l'utilisateur
            {
                $user->setPassword($this->passwordEncoder->encodePassword($user ,$form->getData()['password']));     //On définie le nouveau mot de passe
                if($user->getRoles() == ['ROLE_NOUVEAU'])                                                            //Si le role etait ROLE_NOUVEAU on passe désormais au ROLE_USER
                {
                    $user->setRoles(['ROLE_USER']);                                                                   //Mise en place du role ROLE_USER
                }
                $em->persist($user);                                                                               //Enregistrement en base de donnée
                $em->flush();
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
                //= = = = = = = =  1ERE SOLUTION = = = = = = = = = = = = = //
                /////////////////////////////////////////////////////////////
                //On peut une fois que le mot de passe est changé déconnecter l'utiisateur; (ligne juste en dessous)
                //$token = $this->tokenStorage->getToken()->setAuthenticated(false); //déconnexion de l'utilisateur
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
                /////////////////////////////////////////////////////////////
                //= = = = = = = =  2EME SOLUTION = = = = = = = = = = = = = //
                /////////////////////////////////////////////////////////////
                $dispatcher = new EventDispatcher();
                $token = new UsernamePasswordToken(
                    $user,
                    null,
                    'main',
                    $user->getRoles()
                    );
                $this->tokenStorage->setToken($token);
                $this->session->set('_security_main', serialize($token));
                $this->session->save();
                $event = new InteractiveLoginEvent($request, $token);
                $dispatcher->dispatch("security.interactive_login", $event);
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
                return $this->redirectToRoute('ChangMdp_Succes');
            }else //Si le mot de passe n'est pas bon
            {
                //PENSER A AJOUTER UN MESSAGE D'ERREUR
                return $this->redirectToRoute('change_mdp'); //On redirige sur la même page.
            }
        }
        return $this->render('security/changeMdp.html.twig', ['controller_name' => "Réinitialisation Mot de passe", 'form' => $form->createView()]);
    }
}
