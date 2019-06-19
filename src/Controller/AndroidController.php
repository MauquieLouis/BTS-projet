<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\ORM\EntityManagerInterface;

class AndroidController extends AbstractController
{
    private $passwordEncoder;
    private $userRep;
    private $em;
   
    public function __construct(UserPasswordEncoderInterface $passwordEncoder, UserRepository $userR,EntityManagerInterface $em)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->userRep = $userR;
        $this->em = $em;
    }
    /**
     * @Route("/android/connexion", name="android")
     */
    public function index(UserRepository $userR)
    {
       $data = file_get_contents('php://input');
       $data = json_decode($data);
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
        return $this->render('android/index.html.twig');
       
    }
    /**
     * @Route("/Testconnexion", name="testconnexion")
     */
    public function TestConnection(){
        
        echo"THIS IS AN AMAZING TEST";
        return $this->render('android/index.html.twig');
    }
    /**
     * @Route("/android/user/add", name="add_user")
     */
    public function AddUserAndroid(){
        
        $data = file_get_contents('php://input');
        $data = json_decode($data);
        if(isset($data->name) && isset($data->surname) && isset($data->email))
        {
           $user = new User();
           $user->setNom($data->name);
           $user->setPrenom($data->surname);
           $user->setEmail($data->email);
           $user->setDatecreation(new \DateTime());
           $user->setPassword($this->passwordEncoder->encodePassword($user,$user->getNom()));
           $this->em->persist($user);
           $this->em->flush();
           echo "USER SAVE !";
        }
        else
        {
            echo "REQUEST ERROR FAILED [PARAM USERNAME AND PASSWORD]";
        }
        return $this->render('android/index.html.twig');
    }
    /**
     * @Route("/android/user/liste", name="liste_user")
     */
    public function ListeUserAndroid(UserRepository $uR){
        
        $allUsers = $uR->findAll();
//         $tableUser[][] = null;
        foreach($allUsers as $key=>$user)
        {
            $tableUser[$key]['N'] = $key;
            $tableUser[$key]['id'] = $user->getId();
            $tableUser[$key]['email'] = $user->getEmail();
            $tableUser[$key]['nom'] = $user->getNom();
            $tableUser[$key]['prenom'] = $user->getPrenom();
            $tableUser[$key]['roles'] = $user->getRoles();
        }
        echo json_encode($tableUser);

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
