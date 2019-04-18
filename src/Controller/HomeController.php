<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
/**
 *
 */
class HomeController extends AbstractController
{
    private $tokenStorage;
    
    public function __construct(TokenStorageInterface $tokens)
    {
        $this->tokenStorage = $tokens;
    }
    /**
     * @Route("/", name="Home")
     * 
     */
    public function index()
    {
        //dd($this->tokenStorage->getToken()->isAuthenticated());
       if($this->getUser() != null)
       {
            if($this->getUser()->getRoles() == ['ROLE_NOUVEAU'])
            {
                return $this->redirectToRoute('isFirstConnection');
            }
            return $this->render('home/index.html.twig', [
                'controller_name' => 'HomeController',
            ]);
       }else
       {
           return $this->redirectToRoute('app_login');
       }

    }
    /**
     * @Route("/InformationsCompte", name="compteInformations")
     */
    public function InfosAccount()
    {
        if($this->getUser() != null)
        {
            if($this->getUser()->getRoles() == ['ROLE_NOUVEAU'])
            {
                return $this->redirectToRoute('isFirstConnection');
            }
            return $this->render('home/accountInfos.html.twig',['user' => $this->getUser()]);
        }else
        {
            return $this->redirectToRoute('app_login');
        }
        
    }
}
