<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Event;
use App\Repository\EventRepository;
use App\Entity\Machine;
use App\Repository\MachineRepository;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Entity\Maintenance;
use App\Repository\MaintenanceRepository;

class AjaxReceiveController extends AbstractController
{
    /**
     * @Route("accesbdd/writeevent/{id}/{message}", name="writeevent") 
     */
    public function WriteEvent(EventRepository $repo,EntityManagerInterface $em,$id,$message){
        $message = json_decode($message);
        $fields = $message[0];
        $values = $message[1];
        $retourCode = null;
        if($id === "undefined"){        //Create new row
             $tableToModify = new Event();
        }
        else{                          //Edit existing row
            $tableToModify = $repo->findOneBy(['id'=>$id]);
        }
        foreach ($fields as $i => $it) {
            switch ($it) {
                case 'Title':
                case 'title':
                case 'Titre':
                case 'titre':
                    $tableToModify->setTitle($values[$i]);
                    $retourCode .= "titleSetted;";
                    break;
                case 'description':
                case 'Description':
                    $tableToModify->setDescription($values[$i]);
                    $retourCode .= "descriptionSetted;";

                    break;
                case 'usersid':
                case 'Usersid':
                case 'userid':
                case 'Userid':
                case 'User_id':
                case 'user_id':
                case 'users_id':
                case 'Users_id':
                    $tableToModify->setUsersid($values[$i]);
                    $retourCode .= "usersidSetted;";

                    break;
                case 'machineid':
                case 'Machineid':
                case 'machineId':
                case 'MachineId':
                case 'machine_id':
                case 'Machine_id':
                    $tableToModify->setMachinesid($values[$i]);
                    $retourCode .= "machineidSetted;";

                    break;
                case 'date_start':
                case 'Date_start':
                case 'dateStart':
                    $tableToModify->setDateStart(\DateTime::createFromFormat('Y-m-d', $values[$i]));
                    $retourCode .= "date_startSetted;";

                    break;
                case 'date_end':
                case 'Date_end':
                case 'dateEnd':
                    $tableToModify->setDateEnd(\DateTime::createFromFormat('Y-m-d', $values[$i]));
                    $retourCode .= "date_endSetted;";

                    break;
                case 'frequence':
                case 'Frequence':
                case 'fréquence':
                case 'Fréquence':
                    $tableToModify->setFrequence($values[$i]);
                    $retourCode .= "frequenceSetted;";
                    break;

                default:
                    //DROP TO DEFAULT ERR: WriteEvent::foreach(fields)::switch(it)
                    $retourCode .= "fields[".$i."] unknowed;";
                    break;
            }
        }
        try{
            $em->persist($tableToModify);
            $em->flush();
        }
        catch(Execption $e){
            dd($e->getMessage());
        }

        echo json_encode($retourCode);
        //dd($retourCode);
        //echo $retourCode;
        return $this->render('ajax_receive/index.html.twig'); 
    }



    /**
    * @Route("accesbdd/write/{table}/{id}/{message}", name="writetable")
    */
    public function WriteTable(EntityManagerInterface $em,$table,$id,$message)
    {
        $message = json_decode($message);
        $fields = $message[0];
        $values = $message[1];
        $retourCode = null;

        switch ($table) {
            case 'event':
                $repo = new EventRepository();
                if($id === "undefined"){        //Create new row
                     $tableToModify = new Event();
                }
                else{                          //Edit existing row
                    $tableToModify = $repo->findOneBy(['id'=>$id]);
                }
                foreach ($fields as $i => $it) {
                    switch ($it) {
                        case 'Title':
                        case 'title':
                        case 'Titre':
                        case 'titre':
                            $tableToModify->setTitle($values[$i]);
                            $retourCode .= "titleSetted;";
                            break;

                        case 'description':
                        case 'Description':
                            $tableToModify->setDescription($values[$i]);
                            $retourCode .= "descriptionSetted;";
                            break;

                        case 'usersid':
                        case 'Usersid':
                        case 'userid':
                        case 'Userid':
                        case 'User_id':
                        case 'user_id':
                        case 'users_id':
                        case 'Users_id':
                            $tableToModify->setUsersid($values[$i]);
                            $retourCode .= "usersidSetted;";
                            break;

                        case 'machineid':
                        case 'Machineid':
                        case 'machineId':
                        case 'MachineId':
                        case 'machine_id':
                        case 'Machine_id':
                            $tableToModify->setMachinesid($values[$i]);
                            $retourCode .= "machineidSetted;";
                            break;

                        case 'date_start':
                        case 'Date_start':
                        case 'dateStart':
                            $tableToModify->setDateStart(\DateTime::createFromFormat('Y-m-d', $values[$i]));
                            $retourCode .= "date_startSetted;";
                            break;

                        case 'date_end':
                        case 'Date_end':
                        case 'dateEnd':
                            $tableToModify->setDateEnd(\DateTime::createFromFormat('Y-m-d', $values[$i]));
                            $retourCode .= "date_endSetted;";
                            break;

                        case 'frequence':
                        case 'Frequence':
                        case 'fréquence':
                        case 'Fréquence':
                            $tableToModify->setFrequence($values[$i]);
                            $retourCode .= "frequenceSetted;";
                            break;

                        default:
                            //DROP TO DEFAULT ERR: WriteEvent::foreach(fields)::switch(it)
                            $retourCode .= "fields[".$i."] unknowed;";
                            break;
                    }
                }
                break;

            case 'machine':
                $repo = new MachineRepository();
                if($id === "undefined"){        //Create new row
                    $tableToModify = new Machine();
                }
                else{                          //Edit existing row
                    $tableToModify = $repo->findOneBy(['id'=>$id]);
                }
                foreach ($fields as $i => $it){
                    switch ($it) {
                        case 'name':
                            $tableToModify->setName($values[$i]);
                            $retourCode .= "nameSetted;";
                            break;
                        case 'description':
                            $tableToModify->setDescription($values[$i]);
                            $retourCode .= "nameSetted;";
                            break;
                        case 'imagefilename':
                            $tableToModify->setImageFileName($values[$i]);
                            $retourCode .= "nameSetted;";
                            break;
                        case 'modele_id':
                            $tableToModify->setName($values[$i]);
                            $retourCode .= "nameSetted;";
                            break;
                        default:
                            //DROP TO DEFAULT ERR: WriteEvent::foreach(fields)::switch(it)
                            $retourCode .= "fields[".$i."] unknowed;";
                            break;
                    }
                }
                break;
            default:
                $retourCode = "unknowed table";
                echo json_encode($retourCode);
                break;
        }
        try{
            $em->persist($tableToModify);
            $em->flush();
        }
        catch(Execption $e){
            dd($e->getMessage());
        }
        return $this->render('ajax_receive/index.html.twig'); 
    }

    
    /**
     * @Route("accesbdd/sendevent/{parse}", name="sendevent") 
     */
    public function SendEvent(EventRepository $repo,$parse){
        if($parse && $parse != "undefined"){    //Si aucun id n'est passer en param on fait un SELECT * FROM event; sinon SELECT * FROM event WHERE id = $parse;
           $table = $repo->findOneBy([
                'id'=>$parse
            ]);
            if($table === null){
                $message = json_encode(null);
                echo ($message);
                return $this->render('ajax_receive/index.html.twig'); 
            }
            $tabl = array();
            $j = 0;
            $tabl[$j] = $table->getId();
            $tabl[++$j] = $table->getTitle();
            $tabl[++$j] = $table->getDescription();
            $tabl[++$j] = $table->getUsersid()[0];
            $tabl[++$j] = $table->getMachinesid()[0];
            $tabl[++$j] = $table->getDateStart();
            $tabl[++$j] = $table->getDateEnd();
            $tabl[++$j] = $table->getFrequence();
            
            $message = json_encode($tabl);
            echo ($message);
        
            return $this->render('ajax_receive/index.html.twig'); 
        }
        $table = $repo->findAll();
        if($table === null){
            $message = json_encode(null);
            echo ($message);
            return $this->render('ajax_receive/index.html.twig'); 
        }
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
     /**
     * @Route("accesbdd/sendmachine/{parse}", name="sendmachine") 
     */
    public function SendMachine(MachineRepository $repo,$parse){
        if($parse && $parse != "undefined"){    //Si aucun id n'est passer en param on fait un SELECT * FROM machine; sinon SELECT * FROM machine WHERE id = $parse;
           $table = $repo->findOneBy([
                'id'=>$parse
            ]);
            if($table === null){
                $message = json_encode(null);
                echo ($message);
                return $this->render('ajax_receive/index.html.twig'); 
            }
            $tabl = array();
            
            $j = 0; 
            $tabl[$j] = $table->getId();
            $tabl[++$j] = $table->getName();
            $tabl[++$j] = $table->getDescription();
            $tabl[++$j] = $table->getImagefilename();
            $tabl[++$j] = $table->getModele()->getId();
            
            $message = json_encode($tabl);
            echo ($message);
        
            return $this->render('ajax_receive/index.html.twig'); 
        }
        $table = $repo->findAll();
        if($table === null){
            $message = json_encode(null);
            echo ($message);
            return $this->render('ajax_receive/index.html.twig'); 
        }
        $tabl = array();
        
        for ($i=0; $i < sizeof($table); $i++){
            $j=0;
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][++$j] = $table[$i]->getName();
            $tabl[$i][++$j] = $table[$i]->getDescription();
            $tabl[$i][++$j] = $table[$i]->getImagefilename();
            $tabl[$i][++$j] = $table[$i]->getModele()->getId();
        }
        $message = json_encode($tabl);
        
        echo ($message);
        
        return $this->render('ajax_receive/index.html.twig'); 
    }
    /**
     * @Route("accesbdd/sendmaintenance/{parse}", name="sendmaintenance") 
     */
    public function SendMaintenance(MaintenanceRepository $repo,$parse){
        if($parse && $parse != "undefined"){    //Si aucun id n'est passer en param on fait un SELECT * FROM machine; sinon SELECT * FROM machine WHERE id = $parse;
           $table = $repo->findOneBy([
                'id'=>$parse
            ]);
            if($table === null){
                $message = json_encode(null);
                echo ($message);
                return $this->render('ajax_receive/index.html.twig'); 
            }
            $tabl = array();
            
            $j = 0; 
            $tabl[$j] = $table->getId();
            $tabl[++$j] = $table->getModele()->getId();
            $tabl[++$j] = $table->getNom();
            $tabl[++$j] = $table->getPicturefile();
            $tabl[++$j] = $table->getPicturefilename();
            
            $message = json_encode($tabl);
            echo ($message);
        
            return $this->render('ajax_receive/index.html.twig'); 
        }
        $table = $repo->findAll();
        if($table === null){
            $message = json_encode(null);
            echo ($message);
            return $this->render('ajax_receive/index.html.twig'); 
        }
        $tabl = array();
        
        for ($i=0; $i < sizeof($table); $i++){
            $j=0;            
            $tabl[$i][$j] = $table[$i]->getId();
            $tabl[$i][++$j] = $table[$i]->getModele()->getId();            
            $tabl[$i][++$j] = $table[$i]->getNom();
            $tabl[$i][++$j] = $table[$i]->getPicturefile();
            $tabl[$i][++$j] = $table[$i]->getPicturefilename();

        }
        
        $message = json_encode($tabl);
        echo ($message);
        
        return $this->render('ajax_receive/index.html.twig'); 
    }
    /**
     * @Route("accesbdd/senduser/{parse}", name="senduser") 
     */
    public function SendUser(UserRepository $repo,$parse){
        if($parse && $parse != "undefined"){        //Si aucun id n'est passer en param on fait un SELECT * FROM user; sinon SELECT * FROM user WHERE id = $parse
            $table = $repo->findOneBy([
                'id'=>$parse
            ]);
            if($table === null){
                $message = json_encode(null);
                echo ($message);
                return $this->render('ajax_receive/index.html.twig'); 
            }
            $tabl = array();
            
            $j = 0; 
            $tabl[$j] = $table->getId();
            $tabl[++$j] = $table->getEmail();
            //$tabl[++$j] = $table->getUsername();
            $tabl[++$j] = $table->getRoles();
            $tabl[++$j] = $table->getNom();
            $tabl[++$j] = $table->getPrenom();
            $tabl[++$j] = $table->getDatecreation();
            $message = json_encode($tabl);
            echo ($message);
            return $this->render('ajax_receive/index.html.twig');
        }
        $table = $repo->findAll();
        if($table === null){
            $message = json_encode(null);
            echo ($message);
            return $this->render('ajax_receive/index.html.twig'); 
        }
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
            [ 
                'email' => $session->all()["_security.last_username"]
            ]
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

     /**
     * @Route("variables/sendEventsDates/{dateStart}/{dateEnd}/{id}", name="sendeventsdates") 
     */
    public function SendEventsDates(EventRepository $repo,$dateStart,$dateEnd,$id){

        $dateStart = substr($dateStart,0,10);
        $dateEnd = substr($dateEnd,0,10);
        if ($id === "undefined") {
            $events = $repo->findAllBetweenDates($dateStart,$dateEnd,null);
        }
        else{
            $events = $repo->findAllBetweenDates($dateStart,$dateEnd,$id);
        }
        $tabl = array();
        
        for ($i=0; $i < sizeof($events); $i++){
            $j = 0;
            $tabl[$i][$j] = $events[$i]->getId();
            $tabl[$i][++$j] = $events[$i]->getTitle();
            $tabl[$i][++$j] = $events[$i]->getDescription();
            $tabl[$i][++$j] = $events[$i]->getUsersid()[0];
            $tabl[$i][++$j] = $events[$i]->getMachinesid()[0];
            $tabl[$i][++$j] = $events[$i]->getDateStart();
            $tabl[$i][++$j] = $events[$i]->getDateEnd();
            $tabl[$i][++$j] = $events[$i]->getFrequence();
        }
        //dd($tabl);
        $message = json_encode($tabl);
        echo ($message);
        return $this->render('ajax_receive/index.html.twig');
    }

    /**
     * @Route("/testbdd", name="testbdd")
     * 
     */
    public function index()
    {   
        return $this->render('ajax_receive/annulaire.html.twig');
    }
}
