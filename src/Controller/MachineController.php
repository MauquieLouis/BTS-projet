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
    /**
     * @Route("/machine", name="machine")
     */
    public function index(Request $request, EntityManagerInterface $em)
    {
//      Recuperation de toutes les machines existantes ////////////////
        $repository = $em->getRepository(Machine::class);
        $machines = $repository->findAll();
        $machine = new Machine();
        $formMachine = $this->createForm(NewMachineType::class, $machine);     //creation du formulaire
        $formMachine->handleRequest($request);
        if($formMachine->isSubmitted() && $formMachine->isValid())
        {  
            $blog = $formMachine->getData();
            $this->setData($blog);
            $blog->setPicturedevant('1.jpg');
            $blog->setPicturegauche('2.jpg');
            $blog->setPicturederriere('3.jpg');
            $blog->setPicturedroite('4.jpg');
            $blog->setPicturedessus('5.jpg');
            $blog->setPicturedessous('6.jpg');
            $em->persist($blog);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();
            $nom = '.jpg';
            $formMachine['picturedevant']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '1'.$nom
                );
            $formMachine['picturegauche']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '2'.$nom
                );
            $formMachine['picturederriere']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '3'.$nom
                );
            $formMachine['picturedroite']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '4'.$nom
                );
            $formMachine['picturedessus']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '5'.$nom
                );
            $formMachine['picturedessous']->getData()->move(
                ('image/machine/'.$blog->getId().'/'),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                '6'.$nom
                );
            $em->persist($blog);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();    
            $request = 0;
            return $this->redirectToRoute('machine',);
        }
        return $this->render('machine/index.html.twig', [
            'formMachine' => $formMachine->createView(),
            'controller_name' => 'MachineController',
            'Machines' => $machines,
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
            $nommachine = preg_split("/[\s,;:.#'\"\/\{\-\_]+/",$FormMaintenance['nom']->getData());
            $nomcomplete= "" ;
            for ($i = 0; $i < count($nommachine); $i++) {
                $nomcomplete =  $nomcomplete.$nommachine[$i];
            }            
            $nom = $nomcomplete.$machinegetID->getId().'.jpg';
            $createMaintenance->setPicturefile($nomcomplete);
            $createMaintenance->setPicturefilename($nom);
            $em->persist($createMaintenance);        //Pour ajouter ï¿½ la base de donnï¿½e
            $em->flush();
            $FormMaintenance['picturefile']->getData()->move(
                ('image/machine/'.$machinegetID->getId().'/'.$createMaintenance->getId()),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                $nom
                );
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
        $etapes = $repositoryEtapes->findBy(['maintenance' =>  $repositoryMaintenance->findOneBy(['id' =>$slug])->getId()]);
        //$machine = $repositoryMachine->findOneBy(['id'=> $slug]);
        $machine = $repositoryMachine->findOneBy(['id'=>  $repositoryMaintenance->findOneBy(['id' =>$slug])->getIdMachine()
        ]);
        if(!$machine)
        {
            throw $this->createNotFoundException(sprintf('No machine for slug "%s"', $slug));
        }        
        //////// CREATION DE SPRITE ou ETAPE ///////////////////////////////////
        $sprite = new Etapes();
        $formSaveAllSprite = $this->createForm(EtapesType::class, $sprite);
        $formSaveAllSprite->handleRequest($request);
        $saveRequest = $request;      
        if($formSaveAllSprite->isSubmitted() && 'Sauvegarder' === $formSaveAllSprite->getClickedButton()->getName() )
        {  
            $sprite = $formSaveAllSprite->getData();
            $this->setData($sprite);
            $nameFromSprites = json_decode($sprite->getName());
            $descriptionFromSprites = json_decode($sprite->getDescription());
            $posCameraFromSprites = json_decode($sprite->getCamera());
            $OrdreFromSprites = json_decode($sprite->getEtape());
            $getOdreEtapeAndLengthTableau = json_decode($sprite->getPosition());
            $sprite->setName($nameFromSprites[0]->object->name);
            $sprite->setDescription($descriptionFromSprites[0]);
            $sprite->setPosition($nameFromSprites[0]->object->matrix[12].';'.$nameFromSprites[0]->object->matrix[13].';'.$nameFromSprites[0]->object->matrix[14]);
            $sprite->setCamera($posCameraFromSprites[0]);
            $sprite->setEtape($getOdreEtapeAndLengthTableau[0]);
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
            dd('deletemachine');
            for($i=0;$i< count($maintenances);$i++)
            {
                $em->remove($maintenances[$i]);   
            }   
            $em->remove($machine);
            $em->flush();
            $this->addFlash('danger', "Machine supprimée");
            return $this->redirectToRoute('machine');            
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
               
                $formModele['faceAvant']->getData()->move(
                    ('image/modele/'.$newModele->getId()),              //.$document->getId()  => ï¿½ rajouter si on souhaite ajouter un dossier dans public lors de l'enregistrement de l'image
                    '1.jpg'
                    );
            }
            $em->persist($newModele);
            $em->flush();
            return $this->redirectToRoute('machine');
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
        $modele = $repositoryModele->findOneBy(['id' => $id]);
        $formModele = $this->createForm(NewModeleType::class,$modele);
        $formModele->handleRequest($request);
        if($formModele->isSubmitted() && $formModele->isValid())
        {
            
        }
        return $this->render('machine/editionmodele.html.twig', [
//             'formModele' => $formModele->createView(),
//             'modeles' => $modeles,
            // 'formDeleteMaintenance' => $formDeleteModele->createView(),
        ]);
    }
}
