<?php

namespace App\Form;

use App\Entity\Event;
use App\Entity\User;
use App\Entity\Machine;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\DateType;

class NewEventFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('usersid', CollectionType::class,[
                  'entry_type' => UserType::class,
                  'entry_options' => ['label' => false],
                  'allow_add' => true
            ])
            ->add('machinesid', CollectionType::class, [
                'entry_type' => AddMachineEventType::class,
                'entry_options' => ['label' => false],
                'allow_add' => true
            ])
            ->add('dateStart', DateType::class,['data' => new \DateTime()])
            ->add('frequence',IntegerType::class,['required' => false])
        ;
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Event::class,
        ]);
    }
}
