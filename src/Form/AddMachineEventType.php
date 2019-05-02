<?php

namespace App\Form;

use App\Entity\ModeleMachine;
use App\Entity\Machine;
use App\Repository\MachineRepository;
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
    
    public function __construct(MachineRepository $mR){
        
        $this->mR = $mR;
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
            $machines = null === $modele ? [] : $this->mR->findBy(['modele' => $modele->getId()]);
            $listeMachine = [];
            foreach ($machines as $machine)
            {
                $listeMachine[] = $machine->getName();
            }
            dump($machines);
            dump($listeMachine);
            $form->add('machinesDispo', ChoiceType::class,[
//                 'class' => Machine::class,
                'placeholder'=>'Choisir une machine',
                'choices' => array_flip($listeMachine)
            ]);
        };
        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function(FormEvent $event) use ($formModifier){
                $data = $event->getData();
                dump($data);
                $formModifier($event->getForm(),$data);
                
            }
            );
        $builder->get('ModeleMachine')->addEventListener(
            FormEvents::POST_SUBMIT,
            function(FormEvent $event) use ($formModifier)
            {
                $modele = $event->getForm()->getData();
                dump($modele);
                $formModifier($event->getForm()->getParent(), $modele);
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
