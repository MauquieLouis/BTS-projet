<?php

namespace App\Form;

use App\Entity\ModeleMachine;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ModeleMachineType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('faceAvant')
            ->add('faceArriere')
            ->add('faceGauche')
            ->add('faceDroite')
            ->add('faceHaut')
            ->add('faceBas')
            ->add('nom')
            ->add('fichier3d')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ModeleMachine::class,
        ]);
    }
}
