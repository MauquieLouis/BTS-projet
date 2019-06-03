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
        $this->tokenStorage->getToken()->setAuthenticated(false);
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
                // TOUT CE QUI EST EN DESSOUS PERMET D'AUTHENTIFIER L'UTILISATEUR MANUELLEMENT
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
        return $this->render('security/changeMdp.html.twig',[
            'controller_name' => "Réinitialisation Mot de passe",
            'form' => $form->createView()    
            ]);
    }
    ///////////////////////////////////////////////////////////
    //-----------------------MDP OUBLIE----------------------//
    ///////////////////////////////////////////////////////////
    /**
     * @Route("/MotDePasseOublie", name="MotDePasseOublie")
     */
    public function MdpOublie(Request $request, UserRepository $uR, EntityManagerInterface $em, \Swift_Mailer $mailer)  //Si l'utilisateur clique sur Mot de passe oubié ?
    {
        $form = $this->createformBuilder()                                            //On créer un nouveau formulaire avec un champ email
        ->add('email', EmailType::class)
        ->getForm();
        $form->handleRequest($request);                                              //On attend l'appui sur le bouton valider
        if($form->isSubmitted() && $form->isValid())                                 //Si les données sont correctes
        {
            $user = $uR->findOneBy(['email' => $form->getData()['email']]);          //On cherche un utilisateur avec le même mail renntré dans le formulaire
            //dd($user);
            if($user !== null)                                                       //Si on trouve bien un utilisateur
            {
                $date = new \DateTime();                                             //On récupère la date actuelel
                $date->modify('+2 hour');                                            //On lui ajoute 2 heure
                $token = uniqid();                                                   //On génère un id unique
                $identificateur = $date->format('Y-m-d$H:i:s').'!'.$token;           //On créer une var qui est un string contenant la date + l'id unique
                $user->setResetPassword($identificateur);                            //On met cette identifiant unique dans la conlonne resetpassword de la bdd sur l'utilisateur actuel
                $em->persist($user);                                                 //On sauvegarde en BDD
                $em->flush();
                
                
                $lien = 'http://localhost:8000/resetPasswordMail/'.$identificateur;             //On génère un lien avec l'id unique (le même que celui d'avant)
                //dd($lien);
                $message = (new \Swift_Message('Réinitilisation Mot de passe Farella'))         //fonction implémentée par symfony
                ->setFrom('farellaBTS921@gmail.com')                                            //qui permet d'envoyer un mail
                ->setTo($user->getEmail())                                                      //Dans ce cas on envoie le lien pour réinitialiser le mot de passe
                ->setBody($lien,'text');
                $mailer->send($message);    
                $this->addFlash('info','Mail bien envoyé !');                                   //On ajoute un message pur la confirmation
                return $this->redirectToRoute('app_login');                                     //redirection
            }
            else                                                                                            //Si on ne trouve pas d'utilisateur avec le mail    
            {
                $this->addFlash('danger','Email introuvable !');                                            //On ajoute des message d'infos puis on redirige
                $this->addFlash('warning','Peut-être avez vous mal tapé(e) votre email');
                return $this->redirectToRoute('MotDePasseOublie');
            }

            
        }
        return $this->render('security/forgotPassword.html.twig',['form'=> $form->createView()]);           //rendu de la page
    }
    /**
     * @Route("/resetPasswordMail/{uniqId}",name="resetPassword_Mail")
     */
    public function resetPasswordMail($uniqId, UserRepository $uR, EntityManagerInterface $em, Request $request)        //Lien unique pour réinitialisation du mdp
    {                                                                                                                   //Normalement uniquement accessible depuis un mail
        $user = $uR->findOneBy(['resetPassword' => $uniqId]);                                                           //On récupère l'id unique dans le lien puis on chercher un utilisateur dans la bdd avec cet id unique
        if($user !== null)                                                                                              //Si on trouve un user
        {
            $date = (explode("!",$uniqId))[0];                                                                          //On retranscrit la date au format DateTime
            $date = (explode("$",$date));                                                                               //Déconcaténatin
            $date = $date[0]." ".$date[1];
            $date = new \DateTime($date);                                                                               //Retranscription date
            $actualDate = (new \DateTime);
            if($actualDate > $date)                                                                                     //Si la date actuelle est plus grande que celle récuperer
            {                                                                                                           //dans le lien
                //On met un message
                $this->addFlash('warning', 'Le délai de la clé unique a expiré ! (Rappel: une fois le mail envoyé vous avez XX temps pour changer votre mot de passe)');
                $user->setResetPassword(null);                                               //On annule l'id unique
                $em->persist($user);                                                         //on sauvegarde
                $em->flush();                                                                
                return $this->redirectToRoute('app_login');                                  //redirection
            }
            $form = $this->createForm(ResetPasswordMailFormType::class);                    //On créer un formulaire de réinitilisation de mdp
            $form->handleRequest($request);                                                 //On récupère les requêtes du premier form
            if($form->isSubmitted() && $form->isValid())                                    //Si tout est bon
            { 
                if($actualDate > $date)                                                     //On verifie de nouveau la date une fois le formulaire validé (car la personne peut avoir laissé la page sans valider)
                {
                    $this->addFlash('warning', 'Le délai de la clé unique a expiré ! (Rappel: une fois le mail envoyé vous avez XX temps pour changer votre mot de passe)');
                    $user->setResetPassword(null);
                    $em->persist($user);
                    $em->flush();
                    return $this->redirectToRoute('app_login');
                }
                $user->setPassword($this->passwordEncoder->encodePassword($user ,$form->getData()['password']));            //On change le mdp
                $user->setResetPassword(null);                                                                              //On annule l'id unique
                $em->persist($user);                                                                                        //On sauvegarde
                $em->flush();
                $this->addFlash('success','Mot de passe changé avec succès !');                                             //Message d'info
                return $this->redirectToRoute('app_login');                                                                 //redirection
            }
            
            return $this->render('security/resetPasswordMail.html.twig',['form' => $form->createView()]);
        }
        $this->addFlash('danger','Erreur : Changement de mot de passe impossible, aucune clé n\'a été trouvé ! (Essayez de renvoyer un mail)');
        return $this->redirectToRoute('app_login');
    }
}
