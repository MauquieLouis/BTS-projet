<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Length;

class NewUserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('nom', TextType::class, ['attr'=>['autocomplete' => 'disabled']])
        ->add('prenom', TextType::class, ['attr'=>['autocomplete' => 'disabled']])
        ->add('email', EmailType::class, ['attr'=>['autocomplete' => 'disabled']])
        ;
//         ->add('password', RepeatedType::class, array(
//             'type' => PasswordType::class,
//             'required' => true,
//             'constraints' => array(
//                 new NotBlank(),
//                 new Length(array('min' => 6)),
//             ),
//             'first_options'  => array('label' => 'label.password'),
//             'second_options' => array('label' => 'label.passwordConfirmation'),
//         ));
//         ->add('Password', RepeatedType::class, [
//             // instead of being set onto the object directly,
//             // this is read and encoded in the controller
//             'type' => PasswordType::class,
//             'invalid_message' => 'Les mots de passes doivent êtres similaires.',
//             'options' => ['attr' => ['class' => 'password-field']],
//             'required' => true,
//             'first_options'  => ['label' => 'Mot de passe'],
//             'second_options' => ['label' => 'Confirmer Mot de passe'],
//             'mapped' => false,
//             'constraints' => [
//                 new NotBlank([
//                     'message' => 'Please enter a password',
//                 ]),
//                 new Length([
//                     'min' => 6,
//                     'minMessage' => 'Your password should be at least {{ limit }} characters',
//                     // max length allowed by Symfony for security reasons
//                     'max' => 4096,
//                 ]),
//             ],
//         ])
//         ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
             'data_class' => User::class,
        ]);
    }
}
