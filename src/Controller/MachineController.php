<?php

namespace App\Controller;

use App\Entity\Machine;
use App\Entity\Maintenance;
use App\Entity\Etapes;
use App\Entity\ModeleMachine;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use App\Form\NewMachineType;
use App\Form\EtapesType;
use App\Form\NewMaintenanceType;
use App\Form\NewModeleType;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Driver\Connection;
use Doctrine\Common\Persistence\ObjectManager;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\File\File;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
/**
 * @IsGranted("ROLE_USER")
 * 
 * @author Mod_loc
 *
 */
class MachineController extends AbstractController
{
    protected $data;
    
    public function setData($data)
    {
        $this->data = $data;
    }
    public function getData()
    {
        return $this->data;
    }
    public function rmAllDir($strDirectory)
    {
//         dd('function rmAllDir');
        $handle = opendir($strDirectory);
        while(false !== ($entry = readdir($handle))){
            if($entry != '.' && $entry != '..'){
                if(is_dir($strDirectory.'/'.$entry)){
                    $this->rmAllDir($strDirectory.'/'.$entry);
                }
                elseif(is_file($strDirectory.'/'.$entry)){
                    unlink($strDirectory.'/'.$entry);
                }
            }
        }
        rmdir($strDirectory.'/'.$entry);
        closedir($handle);
    }
    /**
     * @Route("/machine/{modele}", name="machine")
     */
    public function index(Request $request, EntityManagerInterface $em, $modele)
    {
//      Recuperation de toutes les machines existantes ////////////////
        $repository = $em->getRepository(Machine::class);
        $repositoryModele = $em->getRepository(ModeleMachine::class);
        $modeleMachine = $repositoryModele->findOneBy(['id'=> $modele]);
        $machines = $repository->findBy(['modele'=> $modeleMachine]);
        $machine = new Machine();
     
        $machine->setModele($modeleMachine);
        $formMachine = $this->createForm(NewMachineType::class, $machine);     //creation du formulaire
        $formMachine->handleRequest($request);
//         dd($modeleMachine);
        if($formMachine->isSubmitted() && $formMachine->isValid())
        {  
            $blog = $formMachine->getData();
            $this->setData($blog);

       
            $em->persist($blog);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();    
            $request = 0;
            return $this->redirectToRoute('machine',['modele'=> $modele]);
        }
        return $this->render('machine/index.html.twig', [
            'formMachine' => $formMachine->createView(),
            'controller_name' => 'MachineController',
            'Machines' => $machines,
            'modele' => $modeleMachine,
        ]);
    }
    
    /**
     * @Route("/maintenance/{machine}", name="maintenanceModele3D")
     */
    public function viewMaintenances($machine, EntityManagerInterface $em, Request $request)
    {
       $repositoryMaintenance = $em->getRepository(Maintenance::class);
       $repositoryMachine = $em->getRepository(Machine::class);
       $maintenances = $repositoryMaintenance->findBy(['idMachine'=> $repositoryMachine->findOneById(['id'=>$machine])
       ]);
       
       
       
       $machinegetID = $em->getRepository(Machine::class)->findOneBy(['id'=> $machine]);
//////// CREATION FORMULAIRE D UNE MAINTENANCE      
        $maintenance = new Maintenance();
        $FormMaintenance = $this->createForm(NewMaintenanceType::class,$maintenance);     //creation du formulaire
        $FormMaintenance->handleRequest($request);        
        if (($FormMaintenance->isSubmitted() && $FormMaintenance->isValid())) //BOUTON SAUVEGARDER + APERCU
        {
            $createMaintenance = $FormMaintenance->getData();
            $this->setData($createMaintenance);
            $createMaintenance->setIdMachine($machinegetID);
            if ($createMaintenance->getPicturefile()) 
            {
                $nom = $machinegetID->getId().'.jpg';
                $createMaintenance->setPicturefile($nom);
                $createMaintenance->setPicturefilename($nom);
            
           
            $em->persist($createMaintenance);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();
            $FormMaintenance['picturefile']->getData()->move(
                ('image/machine/'.$machinegetID->getId().'/'.$createMaintenance->getId()),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                $nom
                );
            }
            $em->persist($createMaintenance);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();
            $request = 0;
            return $this->redirectToRoute('maintenanceModele3D',['machine' => $machine]);
        }
        return $this->render('machine/maintenance.html.twig', [
            'controller_name' => 'MachineController',
            'formMaintenance' => $FormMaintenance->createView(),
            'maintenances' => $maintenances,
            'machineID' => $machinegetID->getId(),
        ]);
    }    
    /**
     * @Route("/modele/{slug}", name="modele3D")
     */
    public function viewModele($slug, EntityManagerInterface $em, Request $request, ObjectManager $manager)
    {
        $session = new Session();
        $repositoryMachine = $em->getRepository(Machine::class);
        $repositoryMaintenance = $em->getRepository(Maintenance::class);
        $repositoryEtapes = $em->getRepository(Etapes::class);       
        $repositoryModele = $em->getRepository(ModeleMachine::class);
        $etapes = $repositoryEtapes->findBy(['maintenance' =>  $repositoryMaintenance->findOneBy(['id' =>$slug])->getId()]);
        //$machine = $repositoryMachine->findOneBy(['id'=> $slug]);
        $machine = $repositoryMachine->findOneBy(['id'=>  $repositoryMaintenance->findOneBy(['id' =>$slug])->getIdMachine()
        ]);
       
        $modeleMachine = $repositoryModele->findOneBy(['id'=> $machine->getModele()->getId()]);
        if(!$machine)
        {
            throw $this->createNotFoundException(sprintf('No machine for slug "%s"', $slug));
        }        
       
        //////// CREATION DE SPRITE ou ETAPE ///////////////////////////////////
        $sprite = new Etapes();
        $formSaveAllSprite = $this->createForm(EtapesType::class, $sprite);
        $formSaveAllSprite->handleRequest($request);
        $saveRequest = $request;      
        if($formSaveAllSprite->isSubmitted() && $formSaveAllSprite->isValid() )
        {  
            $spriteGoDelete = $repositoryEtapes->findBy(['maintenance'=> $repositoryMaintenance->findOneBy(['id' =>$slug])]);
            foreach($spriteGoDelete as $spritedelete)
            {
                $em->remove($spritedelete);
                $em->flush();
            }
//             return $this->redirectToRoute('modele3D',['slug'=> $slug]);
            $sprite = $formSaveAllSprite->getData();
            $this->setData($sprite);
            $nameFromSprites = json_decode($sprite->getName());
            if($nameFromSprites)
            {
                $descriptionFromSprites = json_decode($sprite->getDescription());
                $posCameraFromSprites = json_decode($sprite->getCamera());
                $getOdreEtapeAndLengthTableau = json_decode($sprite->getPosition());
//                 dd($nameFromSprites[0]);
                if($nameFromSprites[0]->object->name)$sprite->setName($nameFromSprites[0]->object->name);
                if($descriptionFromSprites[0])$sprite->setDescription($descriptionFromSprites[0]);
                if($nameFromSprites[0]->object->matrix[12])$sprite->setPosition($nameFromSprites[0]->object->matrix[12].';'.$nameFromSprites[0]->object->matrix[13].';'.$nameFromSprites[0]->object->matrix[14]);
                if($posCameraFromSprites[0])$sprite->setCamera($posCameraFromSprites[0]);
                if($getOdreEtapeAndLengthTableau[0])$sprite->setEtape($getOdreEtapeAndLengthTableau[0]);
                $sprite->setMachine($machine);
                $sprite->setMaintenance($repositoryMaintenance->findOneBy(['id' => $slug]));
                $em->persist($sprite);
                for($k=1; $k<= (count($getOdreEtapeAndLengthTableau)-1); $k++)
                {
                    $createSprite2 = clone $sprite;
                    $createSprite2->setName($nameFromSprites[$k]->object->name);
                    $createSprite2->setDescription($descriptionFromSprites[$k]);
                    $createSprite2->setPosition($nameFromSprites[$k]->object->matrix[12].';'.$nameFromSprites[$k]->object->matrix[13].';'.$nameFromSprites[$k]->object->matrix[14]);
                    $createSprite2->setCamera($posCameraFromSprites[$k]);
                    $createSprite2->setEtape($getOdreEtapeAndLengthTableau[$k]);
                    $em->persist($createSprite2);
                }
                $em->flush();
            }
            
                return $this->redirectToRoute('modele3D',['slug'=> $slug]);
        }      
        /// Maj Ordre des étapes
        $formSaveOrdreEtapes = $this->createFormBuilder()
        ->getForm();
        $formSaveOrdreEtapes->handleRequest($request);
        if($formSaveOrdreEtapes->isSubmitted() && $formSaveOrdreEtapes->isValid())
        {
            $spriteGoDelete = $repositoryEtapes->findBy(['maintenance'=> $repositoryMaintenance->findOneBy(['id' =>$slug])]);
            foreach($spriteGoDelete as $spritedelete)
            {
                $em->remove($spritedelete);
                $em->flush();
            }
                return $this->redirectToRoute('modele3D',['slug'=> $slug]);
        }
        ////////////DELETE SPRITE ////////////////////////////////////////////        
        $formDeleteSprite = $this->createFormBuilder()
        ->add('idSprite', TextType::class)
        ->add('Suppression', SubmitType::class,  array('label' =>'Supprimer une etape'))
        ->getForm();
        $formDeleteSprite->handleRequest($request);        
        if($formDeleteSprite->isSubmitted() && 'Suppression' === $formDeleteSprite->getClickedButton()->getName())
        {
            $spriteGoDelete = $repositoryEtapes->findBy(['id'=> $formDeleteSprite->getData()['idSprite'] ]);
            foreach($spriteGoDelete as $spritedelete)
            {
                $em->remove($spritedelete);
                $em->flush();
                return $this->redirectToRoute('modele3D',['slug'=> $slug]);
            }
        }
        return $this->render('machine/viewmodel.html.twig', [
            'controller_name' => 'MachineController',
         //   'formEtape' => $formSprite->createView(),
            'formDelete'=> $formDeleteSprite->createView(),
            'machine' => $machine,
            'etapes' => $etapes,
            'saveAllSprites' =>$formSaveAllSprite->createView(),  
            'modeleMachine' =>$modeleMachine,
            'toutsupprimer' => $formSaveOrdreEtapes->createView(),
        ]);   
    }
    
    /**
     * @Route("/machine/edition/{id}", name="machineedition")
     */
    public function machineEdition(Request $request, EntityManagerInterface $em, $id)
    {
        $repository = $em->getRepository(Machine::class);
        $repositoryMaintenance = $em->getRepository(Maintenance::class);
        $machine = $repository->findOneBy(['id' => $id]);
        $maintenances = $repositoryMaintenance->findBy(['idMachine'=> $machine->getId()]);

        $formMachine = $this->createForm(NewMachineType::class, $machine);
        $formMachine->handleRequest($request);

        if($formMachine->isSubmitted() && $formMachine->isValid())
        {
            $newMachine = new Machine();
            $newMachine = $formMachine->getData();
            $em->persist($newMachine);
            $em->flush();
            $this->addFlash('info', 'Modifications enregistrées');
            return $this->redirectToRoute('machine');
        }
        
        $formDeleteMachine = $this->createFormBuilder()
        ->getForm();
        $formDeleteMachine->handleRequest($request);
        if($formDeleteMachine->isSubmitted() &&$formDeleteMachine->isValid() )
        {
       
            for($i=0;$i< count($maintenances);$i++)
            {
                $em->remove($maintenances[$i]);   
            }   
            $em->remove($machine);
            $em->flush();
            $this->addFlash('danger', "Machine supprimée");
            return $this->redirectToRoute('modelesmachines');            
        }     
        return $this->render('machine/editionmachine.html.twig', [
            'formMachine' => $formMachine->createView(),
//             'machine' => $machine,
            'formDeleteMachine' => $formDeleteMachine->createView(),
        ]);
    }    
    /**
     * @Route("/machine/maintenance/edition/{id}", name="maintenanceedition")
     */
    public function maintenanceEdition(Request $request, EntityManagerInterface $em, $id)
    {
        //      Recuperation de toutes les machines existantes         //
        $repositoryMaintenance = $em->getRepository(Maintenance::class);        
        $maintenances = $repositoryMaintenance->findOneBy(['id' => $id]); 
//         $maintenances->setPicturefile(new File('image\machine\\'.$maintenances->getIdMachine()->getId().'\\'.$maintenances->getId().'/'.$maintenances->getPicturefilename())
//             );
     //   $maintenances->setNom('99');
        $formMaintenances = $this->createForm(NewMaintenanceType::class,$maintenances);
        $formMaintenances->handleRequest($request);
//         dd($formMaintenances);
        if($formMaintenances->isSubmitted() && $formMaintenances->isValid())
        {            
            $newMaintenance = new Maintenance();
            $newMaintenance = $formMaintenances->getData();
            if ($newMaintenance->getPicturefile()) {
                $newMaintenance->setPicturefile($maintenances->getId());
                $nom = $maintenances->getId().$maintenances->getIdMachine()->getId().'.jpg';
                $newMaintenance->setPicturefilename($nom);
                $formMaintenances['picturefile']->getData()->move(
                    ('image/machine/'.$maintenances->getIdMachine()->getId().'/'.$maintenances->getId()),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            
            $em->persist($newMaintenance);
            $em->flush();
            return $this->redirectToRoute('maintenanceModele3D',['machine'=> $maintenances->getIdMachine()->getId()] );
        }
        $formDeleteMaintenance = $this->createFormBuilder()
        ->getForm();
        $formDeleteMaintenance->handleRequest($request);
        if($formDeleteMaintenance->isSubmitted() &&$formDeleteMaintenance->isValid() )
        {            
            $em->remove($maintenances);
            $em->flush();
            $this->addFlash('danger', "Maintenance supprimée");
            return $this->redirectToRoute('maintenanceedition',['id'=> $id] );
        }
        return $this->render('machine/editionmaintenance.html.twig', [
            'formMaintenance' => $formMaintenances->createView(),
        //    'machine' => $machine,
            'formDeleteMaintenance' => $formDeleteMaintenance->createView(),
        ]);
    }
    /**
     * @Route("/modeles", name="modelesmachines")
     */
    public function showModelesMachines(Request $request, EntityManagerInterface $em)
    {
        $repositoryModele = $em->getRepository(ModeleMachine::class);
        $modeles = $repositoryModele->findAll();
        $newModele = new ModeleMachine();
        $formModele = $this->createForm(NewModeleType::class,$newModele);
        $formModele->handleRequest($request);
        if( ($formModele->isSubmitted() && $formModele->isValid() ))
        {
            $newModele = $formModele->getData();
            $em->persist($newModele);
            $em->flush();
            if ($newModele->getFaceAvant()) {
                $nom = '1.jpg';
                $newModele->setFaceAvant($nom);
                $formModele['faceAvant']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            if ($newModele->getFaceGauche()) {
                $nom = '2.jpg';
                $newModele->setFaceGauche($nom);
                $formModele['faceGauche']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            if ($newModele->getFaceArriere()) {
                $nom = '3.jpg';
                $newModele->setFaceArriere($nom);
                $formModele['faceArriere']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            if ($newModele->getFaceDroite()) {
                $nom = '4.jpg';
                $newModele->setFaceDroite($nom);
                $formModele['faceDroite']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            if ($newModele->getFaceHaut()) {
                $nom = '5.jpg';
                $newModele->setFaceHaut($nom);
                $formModele['faceHaut']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            if ($newModele->getFaceBas()) {
                $nom = '6.jpg';
                $newModele->setFaceBas($nom);
                $formModele['faceBas']->getData()->move(
                    ('image/modele/'.$newModele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            
            
            $em->persist($newModele);
            $em->flush();
            return $this->redirectToRoute('modelesmachines');
        }
        return $this->render('machine/modelesmachine.html.twig', [
            'formModele' => $formModele->createView(),
               'modeles' => $modeles,
           // 'formDeleteMaintenance' => $formDeleteModele->createView(),
        ]);
    }
    /**
     * @Route("/modeles/edition/{id}", name="modeleedition")
     */
    public function EditionModelesMachines(Request $request, EntityManagerInterface $em, $id)
    {
        $repositoryModele = $em->getRepository(ModeleMachine::class);
        $repositoryMachine = $em->getRepository(Machine::class);
        $modele = $repositoryModele->findOneBy(['id' => $id]);
        $machines = $repositoryMachine->findBy(['modele' => $modele->getId()]);

        $formModele = $this->createForm(NewModeleType::class,$modele);
        $formModele->handleRequest($request);
        if($formModele->isSubmitted() && $formModele->isValid())
        {
            $newModele = new Maintenance();
            $newModele = $formModele->getData();
            if ($newModele->getFaceAvant()) {
                $nom = '1.jpg';
                $newModele->setFaceAvant($nom);
                $formModele['faceAvant']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            else{ $newModele->setFaceAvant('1.jpg');}
            if ($newModele->getFaceGauche()) {
                $nom = '2.jpg';
                $newModele->setFaceGauche($nom);
                $formModele['faceGauche']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            else{ $newModele->setFaceGauche('2.jpg');}
            if ($newModele->getFaceArriere()) {
                $nom = '3.jpg';
                $newModele->setFaceArriere($nom);
                $formModele['faceArriere']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            else{ $newModele->setFaceArriere('3.jpg');}
            if ($newModele->getFaceDroite()) {
                $nom = '4.jpg';
                $newModele->setFaceDroite($nom);
                $formModele['faceDroite']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            else{ $newModele->setFaceDroite('4.jpg');}
            if ($newModele->getFaceHaut()) {
                $nom = '5.jpg';
                $newModele->setFaceHaut($nom);
                $formModele['faceHaut']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            }
            else{ $newModele->setFaceHaut('5.jpg');}
            if ($newModele->getFaceBas()) {
                $nom = '6.jpg';
                $newModele->setFaceBas($nom);
                $formModele['faceBas']->getData()->move(
                    ('image/modele/'.$modele->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    $nom
                    );
            } else{ $newModele->setFaceBas('6.jpg');}
            $em->persist($newModele);
            $em->flush();
            return $this->redirectToRoute('modelesmachines');
          
        }
        $formDeleteModele = $this->createFormBuilder()
        ->getForm();
        $formDeleteModele->handleRequest($request);
        if($formDeleteModele->isSubmitted() &&$formDeleteModele->isValid() )
        {
            $this->rmAllDir('image/modele/'.$modele->getId());
            foreach($machines as $machine)
            {
                $this->rmAllDir('image/machine/'.$machine->getId());
            }
//             dd('fin');
            $em->remove($modele);
            $em->flush();
            $this->addFlash('danger', "Modèle supprimé");
            return $this->redirectToRoute('modelesmachines');
        }
        return $this->render('machine/editionmodele.html.twig', [
            'formModele' => $formModele->createView(),
//             'modeles' => $modeles,
            'formDeleteModele' => $formDeleteModele->createView(),
        ]);
    }
}
