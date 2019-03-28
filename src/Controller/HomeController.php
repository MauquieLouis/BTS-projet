<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
/**
 * @IsGranted("ROLE_USER")
 */
class HomeController extends AbstractController
{
    /**
     * @Route("/", name="Home")
     * 
     */
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    /**
     * @Route("/InformationsCompte", name="compteInformations")
     */
    public function InfosAccount()
    {
        return $this->render('home/accountInfos.html.twig',['user' => $this->getUser()]);
    }
}
