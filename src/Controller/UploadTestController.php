<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UploadTestController extends AbstractController
{
    /**
     * @Route("/upload/test", name="upload_test")
     */
    public function index()
    {
        return $this->render('upload_test/index.html.twig', [
            'controller_name' => 'UploadTestController',
        ]);
    }
}
