<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="Home")
     * @IsGranted("ROLE_USER")
     */
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    /**
     * @Route("/ChangeMdp/Succes", name="ChangMdp_Succes")
     */
    public function ChangeMdpSucces(TokenStorageInterface $token)
    {
        $user = $this->getUser();
        return $this->render('home/changeMdpSucces.html.twig', ['user' => $user->getRoles()]);
    }
    
    /**
     * @Route("/Infos", name="Infos")
     */
    public function Infos(TokenStorageInterface $token, SessionInterface $session)
    {
        dd($token->getToken(),$session->all(), $this->getUser(),$token->getToken()->getCredentials() );
        return null;
    }
}
