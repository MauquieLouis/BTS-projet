<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\Event;
use App\Repository\EventRepository;
use App\Entity\Machine;
use App\Repository\MachineRepository;
use App\Entity\User;
use App\Repository\UserRepository;


class AjaxReceiveController extends AbstractController
{
    /**
     * @Route("accesbdd/sendevent", name="sendevent") 
     */
    public function SendEvent(EventRepository $repo){
        $table = $repo->findAll();

        $tabl = array();
        
        for ($i=0; $i < sizeof($table); $i++){
            $j = 0;
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][++$j] = $table[$i]->getTitle();
            $tabl[$i][++$j] = $table[$i]->getDescription();
            $tabl[$i][++$j] = $table[$i]->getUsersid();
            $tabl[$i][++$j] = $table[$i]->getMachinesid();
            $tabl[$i][++$j] = $table[$i]->getDateStart();
            $tabl[$i][++$j] = $table[$i]->getDateEnd();
            $tabl[$i][++$j] = $table[$i]->getFrequence();
        }
        $message = json_encode($tabl);

        echo ($message);
        
        return $this->render('ajax_receive/index.html.twig'); 
    }
       /* if($parse){
            $table = $repo->findOneBy([
                'id'=>$parse
            ]);

            //dd($table);

            $tabl = array();

            $j = 0; 
            $tabl[$j] = $table->getId();
            $tabl[++$j] = $table->getTitle();
            $tabl[++$j] = $table->getDescription();
            $tabl[++$j] = $table->getUsersid();
            $tabl[++$j] = $table->getMachinesid();
            $tabl[++$j] = $table->getDateStart();
            
            $tabl[++$j] = $table->getDateEnd();
            $tabl[++$j] = $table->getFrequence();
            
            //dd($tabl);
            
            $message = json_encode($tabl);
            echo ($message);
        }
        else{*/
/*            $table = $repo->findAll();

            $tabl = array();
            for ($i=0; $i < sizeof($table); $i++){
                $j = 0;
                $tabl[$i][$j] = $table[$i]->getId();
                $tabl[$i][++$j] = $table[$i]->getTitle();
                $tabl[$i][++$j] = $table[$i]->getDescription();
                $tabl[$i][++$j] = $table[$i]->getUsersid();
                $tabl[$i][++$j] = $table[$i]->getMachinesid();
                $tabl[$i][++$j] = $table[$i]->getDateStart();
                $tabl[$i][++$j] = $table[$i]->getDateEnd();
                $tabl[$i][++$j] = $table[$i]->getFrequence();
            }

            $message = json_encode(tabl);
            echo ($message);*/
        //}

        /*
        return $this->render('ajax_receive/index.html.twig');*/
    //}

     /**
     * @Route("accesbdd/sendmachine", name="sendmachine") 
     */
    public function SendMachine(MachineRepository $repo){
        $table = $repo->findAll();

        $tabl = array();
        
        for ($i=0; $i < sizeof($table); $i++){
            $j=0;
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][++$j] = $table[$i]->getName();
            $tabl[$i][++$j] = $table[$i]->getDescription();
            $tabl[$i][++$j] = $table[$i]->getImagefilename();
        }
        
        $message = json_encode($tabl);
        echo ($message);
        
        return $this->render('ajax_receive/index.html.twig'); 
    }

    /**
     * @Route("accesbdd/senduser", name="senduser") 
     */
    public function SendUser(UserRepository $repo){
      //  $repo = $this->getDoctrine()->getRepository(User::class);
        $table = $repo->findAll();
        $tabl = array();
        for ($i=0; $i < sizeof($table); $i++){
            $j=0; 
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][++$j] = $table[$i]->getEmail();
            //$tabl[$i][++$j] = $table[$i]->getUsername();
            $tabl[$i][++$j] = $table[$i]->getRoles();
            $tabl[$i][++$j] = $table[$i]->getNom();
            $tabl[$i][++$j] = $table[$i]->getPrenom();
            $tabl[$i][++$j] = $table[$i]->getDatecreation();
        }
        
        $message = json_encode($tabl);

        echo ($message);

        return $this->render('ajax_receive/index.html.twig');
    }

    /**
     * @Route("variables/sendsession", name="sendsession") 
     */
    public function SendSession(SessionInterface $session,UserRepository $repo){
        $user = $repo->findby(
            [ 'email' => $session->all()["_security.last_username"] ]
        );
        $tabl = array();

        $j=0;
        $tabl[$j] = $user[0]->getId();
        $tabl[++$j] = $user[0]->getEmail();
        //$tabl[++$j] = $user[0]->getUsername();
        $tabl[++$j] = $user[0]->getRoles();
        $tabl[++$j] = $user[0]->getNom();
        $tabl[++$j] = $user[0]->getPrenom();
        $tabl[++$j] = $user[0]->getDatecreation();
        
        $message = json_encode($tabl);
        
        echo ($message);

        return $this->render('ajax_receive/index.html.twig');
    }
}


