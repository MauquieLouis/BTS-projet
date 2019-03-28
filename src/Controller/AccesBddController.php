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

        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][0] = $table[$i]->getTitle();
            $tabl[$i][1] = $table[$i]->getDescription();
            $tabl[$i][2] = $table[$i]->getUsersid();
            $tabl[$i][3] = $table[$i]->getMachinesid();
            $tabl[$i][4] = $table[$i]->getDateStart();
            $tabl[$i][5] = $table[$i]->getDateEnd();
            $tabl[$i][6] = $table[$i]->getFrequence();
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

        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][0] = $table[$i]->getTitle();
            $tabl[$i][1] = $table[$i]->getDescription();
            $tabl[$i][2] = $table[$i]->getUsersid();
            $tabl[$i][3] = $table[$i]->getMachinesid();
            $tabl[$i][4] = $table[$i]->getDateStart();
            $tabl[$i][5] = $table[$i]->getDateEnd();
            $tabl[$i][6] = $table[$i]->getFrequence();
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

        for ($i=0; $i < sizeof($table); $i++){
            $tabl[$i][0] = $table[$i]->getTitle();
            $tabl[$i][1] = $table[$i]->getDescription();
            $tabl[$i][2] = $table[$i]->getUsersid();
            $tabl[$i][3] = $table[$i]->getMachinesid();
            $tabl[$i][4] = $table[$i]->getDateStart();
            $tabl[$i][5] = $table[$i]->getDateEnd();
            $tabl[$i][6] = $table[$i]->getFrequence();
        }
        
        $message = json_encode($tabl);
        echo ($message);

        return $this->render('acces_bdd/index.html.twig');
    }
}
