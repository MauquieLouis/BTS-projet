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
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use App\Repository\UserRepository;
use App\Form\ResetPasswordMailFormType;

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
     * @Route("/ChangeMdp", name="change_mdp")
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
                $this->addFlash('info','Mot de passe changé avec succes !');
                return $this->redirectToRoute('Home');
            }else //Si le mot de passe n'est pas bon
            {
                //PENSER A AJOUTER UN MESSAGE D'ERREUR
                $this->addFlash('warning','Ancien Mot de passe invalide, veuillez réessayer.');
                return $this->redirectToRoute('change_mdp'); //On redirige sur la même page.
            }
        }
        return $this->render('security/changeMdp.html.twig', ['controller_name' => "Réinitialisation Mot de passe", 'form' => $form->createView()]);
    }
    ///////////////////////////////////////////////////////////
    //-----------------------MDP OUBLIE----------------------//
    ///////////////////////////////////////////////////////////
    /**
     * @Route("/MotDePasseOublie", name="MotDePasseOublie")
     */
    public function MdpOublie(Request $request, UserRepository $uR, EntityManagerInterface $em, \Swift_Mailer $mailer)
    {
        $form = $this->createformBuilder()
        ->add('email', EmailType::class)
        ->getForm();
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid())
        {
            $user = $uR->findOneBy(['email' => $form->getData()['email']]);
            //dd($user);
            if($user !== null)
            {
                $token = uniqid();
                $user->setResetPassword($token);
                $em->persist($user);
                $em->flush();
                
                
                $lien = 'http://10.100.0.78:8000/resetPasswordMail/'.$token;
                //dd($lien);
                $message = (new \Swift_Message('Réinitilisation Mot de passe Farella'))
                ->setFrom('farellaBTS921@gmail.com')
                ->setTo($user->getEmail())
                ->setBody($lien,'text');
                $mailer->send($message);
                return $this->redirectToRoute('app_login');
            }

            
        }
        return $this->render('security/forgotPassword.html.twig',['form'=> $form->createView()]);
    }
    /**
     * @Route("/resetPasswordMail/{uniqId}",name="resetPassword_Mail")
     */
    public function resetPasswordMail($uniqId,UserRepository $uR, EntityManagerInterface $em, Request $request)
    {
        $user = $uR->findOneBy(['resetPassword' => $uniqId]);
        if($user !== null)
        {
            $form = $this->createForm(ResetPasswordMailFormType::class);
            $form->handleRequest($request);                                                 //On récupère les requêtes du premier form
            if($form->isSubmitted() && $form->isValid())
            { 
                $user->setPassword($this->passwordEncoder->encodePassword($user ,$form->getData()['password']));
                $user->setResetPassword(null);
                $em->persist($user);
                $em->flush();
                
                return $this->redirectToRoute('Home');
            }
            
            return $this->render('security/resetPasswordMail.html.twig',['form' => $form->createView()]);
        }
        return $this->redirectToRoute('Home');
    }
}
