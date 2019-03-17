<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin/controlUser", name="admin_UserControl")
     */
    public function index()
    {
        return $this->render('admin/userControl.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }
}
