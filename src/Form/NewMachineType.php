<?php

namespace App\Form;

use App\Entity\Machine;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\FileType;

use Symfony\Component\HttpFoundation\File\File;

class NewMachineType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('description', TextareaType::class)
            ->add('picturedevant', FileType::class,  ['data_class' => null, 'required' => false] )
            ->add('picturegauche', FileType::class, ['data_class' => null, 'required' => false]  )
            ->add('picturederriere', FileType::class, ['data_class' => null, 'required' => false]  )
            ->add('picturedroite', FileType::class, ['data_class' => null, 'required' => false]  )
            ->add('picturedessus', FileType::class, ['data_class' => null, 'required' => false]  )
            ->add('picturedessous', FileType::class, ['data_class' => null, 'required' => false]  )
//             ->add('Enregistrer', SubmitType::class,  array('label' =>'Save Machine'))
        ;
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Machine::class,
        ]);
    }
}
