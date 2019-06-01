<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Length;


class ChangePasswordFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('oldPassword', PasswordType::class,['attr' => ['placeholder' => 'Mot de passe actuel']])
            ->add('password', RepeatedType::class,[
                'type' => PasswordType::class,
                'invalid_message' => 'Les nouveaux mots de passe doivent être les mêmes.',
                'options' => ['attr' => ['class' => 'password-field form-control form-control-sm']],
                'required' => true,
                'first_options'  => ['attr' => ['placeholder' => 'Nouveau Mot de passe','class' => 'password-field form-control form-control-sm']],
                'second_options' => ['attr' => ['placeholder' => 'Confirmer le nouveau Mot de passe','class' => 'password-field form-control form-control-sm']],
                'constraints' => [
                        new NotBlank([
                                'message' => 'Merci de rentrer un Mot de passe',
                            ]),
                        new Length([
                                'min' => 6,
                            'minMessage' => 'Votre Mot de passe doit au moins contenir {{ limit }} caractères',
                            // max length allowed by Symfony for security reasons
                            'max' => 4096,
                        ]),
                    ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
//             'data_class' => User::class,
        ]);
    }
}
