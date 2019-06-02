<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AndroidController extends AbstractController
{
    private $passwordEncoder;
    private $userRep;
   
    public function __construct(UserPasswordEncoderInterface $passwordEncoder, UserRepository $userR)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->userRep = $userR;
    }
    /**
     * @Route("/android/connexion", name="android")
     */
    public function index(UserRepository $userR)
    {
//         $user = $userR->findOneBy(['id' => 20]);
       
// //         $user2 = new User();
        
//         $tableUser['id'] = $user->getId();
//         $tableUser['email'] = $user->getEmail();
//         $tableUser['roles'] = $user->getRoles();
//         $tableUser['password'] = $user->getPassword();
//         $tableUser['Nom'] = $user->getNom();
//         $tableUser['prenom'] = $user->getPrenom();
//         $tableUser['datecreation'] = $user->getDateCreation(); 
//         $tableUser['resetPassword'] = $user->getResetPassword();
        
//         $myJSON = json_encode($tableUser);
// //         $decode = (json_decode($myJSON));
// //         dd($user, $myJSON, $decode->{'id'} );
//         echo ;

        //unset($_GET);
       $data = file_get_contents('php://input');
       $data = json_decode($data);
       //echo $data->username;      //Solution fonctionelle
       if(isset($data->username) && isset($data->password))
       {
           
           $kid = $this->login($data->username, $data->password);
           if($kid)
           {
               $table["valid"] = true;
               $table["nom"] = $kid->getNom();
               $table["prenom"] = $kid->getPrenom();
               $table["email"] = $kid->getEmail();
               $table["dateCrea"] = $kid->getDatecreation();
               $table["password"] = $kid->getPassword();
               $table["roles"]= $kid->getRoles();
               
               echo json_encode($table);
           }else
           {
               $table["valid"] = false;
               $table["info"] = "NO USER FOUND";
               echo json_encode($table);
           }
       }
       else
       {
           echo "REQUEST ERROR FAILED [PARAM USERNAME AND PASSWORD]";
       }

        
        /*if(isset($_GET['username']) && isset($_GET['password'])){
            
            $login = $_GET['username'];
            $password = $_GET['password'];
            
            //unset($_POST);
            $kid = $this->login($login, $password);
            if($kid)
            {
                //dd('Erreur KID = 0');
                $table["nom"] = $kid->getNom();
                $table["prenom"] = $kid->getPrenom();
                $table["email"] = $kid->getEmail();
                $table["dateCrea"] = $kid->getDatecreation();
                $table["roles"]= $kid->getRoles();
                
                echo json_encode($table);
            }else
            {
                echo "Error 1/Wrong Password/or/Wrong Email";
                //printf('<user id="%d"/>'."\n",$kid->getId());
            }
        }else{
            echo "NO USER SET";
            //echo $_GET['username'];
        }*/
        
        return $this->render('android/index.html.twig');
    //}
       
    }
    /**
     * @Route("/Testconnexion", name="testconnexion")
     */
    public function TestConnection(){
        
        echo"THIS IS AN AMAZING TEST";
        return $this->render('android/index.html.twig');
    }
    
    private function LogIn($login, $password)
    {
        $user = $this->userRep->findOneBy(['email' => $login]);
        if($user == null) return 0;
        $ispasswordValid = $this->passwordEncoder->isPasswordValid($user, $password);
        if($ispasswordValid)
        {
            return $user;
        }else
        {
            return 0;
        }
    }
}
