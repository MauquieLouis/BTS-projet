<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Event;
use App\Repository\EventRepository;
use App\Entity\Machine;
use App\Repository\MachineRepository;
use App\Entity\User;
use App\Repository\UserRepository;

class AccesBddController extends AbstractController
{
    /**
     * @Route("accesbdd/sendevent", name="sendevent") 
     */
    public function SendEvent(EventRepository $repo){
        $repo = $this->getDoctrine()->getRepository(Event::class);
        $table = $repo->findAll();

        $tabl = array();
        $j = 0;
        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][$j++] = $table[$i]->getTitle();
            $tabl[$i][$j++] = $table[$i]->getDescription();
            $tabl[$i][$j++] = $table[$i]->getUsersid();
            $tabl[$i][$j++] = $table[$i]->getMachinesid();
            $tabl[$i][$j++] = $table[$i]->getDateStart();
            $tabl[$i][$j++] = $table[$i]->getDateEnd();
            $tabl[$i][$j++] = $table[$i]->getFrequence();
            $j=0;
        }
        
        $message = json_encode($tabl);
        echo ($message);

        return $this->render('acces_bdd/index.html.twig');
    }

     /**
     * @Route("accesbdd/sendmachine", name="sendmachine") 
     */
    public function SendMachine(MachineRepository $repo){
        $repo = $this->getDoctrine()->getRepository(Machine::class);
        $table = $repo->findAll();

        $tabl = array();
        
        $j = 0;
        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][$j++] = $table[$i]->getName();
            $tabl[$i][$j++] = $table[$i]->getDescription();
            $tabl[$i][$j++] = $table[$i]->getImagefilename();
            $j=0;
        }
        
        $message = json_encode($tabl);
        echo ($message);
        
        return $this->render('acces_bdd/index.html.twig');
    }

    /**
     * @Route("accesbdd/senduser", name="senduser") 
     */
    public function SendUser(UserRepository $repo){
        $repo = $this->getDoctrine()->getRepository(User::class);
        $table = $repo->findAll();

        $tabl = array();
        $j = 0;
        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][$j++] = $table[$i]->getEmail();
            $tabl[$i][$j++] = $table[$i]->getUsername();
            $tabl[$i][$j++] = $table[$i]->getRoles();
            $tabl[$i][$j++] = $table[$i]->getNom();
            $tabl[$i][$j++] = $table[$i]->getPrenom();
            $tabl[$i][$j++] = $table[$i]->getDatecreation();
            $j=0;
        }
        
        $message = json_encode($tabl);

        echo ($message);

        return $this->render('acces_bdd/index.html.twig');
    }
}
