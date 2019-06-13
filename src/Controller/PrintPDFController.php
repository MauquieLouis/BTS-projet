<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;


use App\Entity\Event;
use App\Repository\EventRepository;



class PrintPDFController extends AbstractController
{
    /**
     * @Route("/printpdf", name="printpdf")
     */
    public function index(EventRepository $er)
    {
        $tabEvent = $er->findBy(['valid'=>1]);
        //dd($tabEvent[0]->getDescription(), count($tabEvent));
        
        $pdf = new \FPDF();
        $pdf->addPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetTextColor(0,0,0);
        
        
       // for($i=0; $i < count($tabEvent); $i++){
          
           // $pdf->writeHTML($tbl, true, false, false, false, '');
            $pdf->Multicell(190, 5, $tabEvent[1]->getDescription(), '', 'C', false);
       
        
  
        
        
        return new Response($pdf->Output(), 200, array(
            'Content-type' => 'application/pdf'
       ));
        
        return $this->render('print_pdf/index.html.twig', [
            'controller_name' => 'PrintPDFController',
        ]);
    }
}

