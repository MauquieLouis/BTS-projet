<?php

namespace App\Form;

use App\Entity\ModeleMachine;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\File\File;

class NewModeleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', TextType::class)
            ->add('faceAvant',  FileType::class, ['data_class' => null, 'required' => true] )
            ->add('faceArriere',  FileType::class, ['data_class' => null, 'required' => false] )
            ->add('faceGauche',  FileType::class, ['data_class' => null, 'required' => false] )
            ->add('faceDroite',  FileType::class, ['data_class' => null, 'required' => false] )
            ->add('faceHaut',  FileType::class, ['data_class' => null, 'required' => false] )
            ->add('faceBas',  FileType::class, ['data_class' => null, 'required' => false] )
            ->add('fichier3d', FileType::class, ['data_class' => null, 'required' => false])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ModeleMachine::class,
        ]);
    }
}
