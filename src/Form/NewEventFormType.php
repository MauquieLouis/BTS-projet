<?php

namespace App\Form;

use App\Entity\Event;
use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;


class NewEventFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('usersid', EntityType::class, ['class'=>User::class, 'choice_label'=>function(User $user){return $user->getNom();}])
           // ->add('machinesid', EntityType::class, ['class'=>Machine::class, 'choice_label'=>function(Machine $machine){return $user->getId();}])
            ->add('dateStart')
            ->add('frequence')
        ;
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Event::class,
        ]);
    }
}
