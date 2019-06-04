<?php

namespace App\Form;

use App\Entity\ModeleMachine;
use App\Entity\Machine;
use App\Repository\MachineRepository;
use App\Repository\MaintenanceRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;

class AddMachineEventType extends AbstractType
{
    private $mR;
    private $maintenanceR;
    
    public function __construct(MachineRepository $mR, MaintenanceRepository $maintenanceR){
        
        $this->mR = $mR;
        $this->maintenanceR = $maintenanceR;
    }
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('ModeleMachine', EntityType::class,[
                'class' => ModeleMachine::class,
                'choice_label' => 'nom',
                'placeholder' => 'Choisir un modèle de machine'
            ])
        ;
        
        $formModifier = function(FormInterface $form, ModeleMachine $modele = null)
        {
            $machines = null === $modele ? [] : $this->maintenanceR->findBy(['modele' => $modele->getId()]);
            $listeMachine = [];
            foreach ($machines as $machine)
            {
                $listeMachine[$machine->getId()] = $machine->getNom();
            }
//             dump($listeMachine);s
            $form->add('maintenancesDispo', ChoiceType::class,[
//                 'class' => Machine::class,
                'placeholder'=>'Choisir une machine',
                'choices' => array_flip($listeMachine)
            ]);
        };
        
        $formModifier2 = function(FormInterface $form, ModeleMachine $modele = null)
        {
            $machines = null === $modele ? [] : $this->mR->findBy(['modele' => $modele->getId()]);
            $listeMachine = [];
            foreach ($machines as $machine)
            {
                $listeMachine[$machine->getId()] = $machine->getName();
            }
            //             dump($listeMachine);s
            $form->add('machinesDispo', ChoiceType::class,[
            //                 'class' => Machine::class,
                'placeholder'=>'Choisir une machine',
                'choices' => array_flip($listeMachine)
            ]);
        };
        
        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function(FormEvent $event) use ($formModifier){
//                 dump('EventListener PRE_SET_DATA');
                $data = $event->getData();
                $formModifier($event->getForm(),$data);
                
            }
            );
        $builder->get('ModeleMachine')->addEventListener(
            FormEvents::POST_SUBMIT,
            function(FormEvent $event) use ($formModifier)
            {
//                 dump('EventListener POST_SUBMIT');
                $modele = $event->getForm()->getData();
                $formModifier($event->getForm()->getParent(), $modele);
            }   
            );
        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function(FormEvent $event) use ($formModifier2){
                //                 dump('EventListener PRE_SET_DATA');
                $data = $event->getData();
                $formModifier2($event->getForm(),$data);
                
            }
            );
        $builder->get('ModeleMachine')->addEventListener(
            FormEvents::POST_SUBMIT,
            function(FormEvent $event) use ($formModifier2)
            {
                //                 dump('EventListener POST_SUBMIT');
                $modele = $event->getForm()->getData();
                $formModifier2($event->getForm()->getParent(), $modele);
        }
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
