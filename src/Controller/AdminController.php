<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\NewUserFormType;
use App\Entity\User;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        return $this->render('admin/index.html.twig', [

        ]);
    }
    
    /**
     * @Route("/admin/controlUser", name="admin_UserControl")
     */
    public function UserControl()
    {
        return $this->render('admin/userControl.html.twig', [
            
        ]);
    }
    
    /**
     * @Route("/admin/controlUser/newUser", name="admin_UserControl_newUser")
     */
    public function newUser()
    {
        $form = $this->createForm(NewUserFormType::class);
        
        if($form->isSubmitted() && $form->isValid())
        {
            $this->redirectToRoute('Home');
        }  
        return $this->render('admin/newUser.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
