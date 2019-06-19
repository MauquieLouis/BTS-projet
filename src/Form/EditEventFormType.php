<?php

namespace App\Form;

use App\Entity\Event;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EditEventFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        //dd($options['data']->getUsersid());
        $builder
            ->add('title')
            ->add('description');
            foreach($options['data']->getUsersid() as $key=>$user)
            {
                $builder->add('users'.$key);
            }
//             ->add('usersid', CollectionType::class,[
//                 'entry_type' => UserType::class,
//                 'entry_options' => ['label' => false],
//                 'allow_add' => true,
// //                 'data' => $options['data']->getUsersid()
//                 'mapped' => false
//             ])
//             ->add('machinesid')
//             ->add('dateStart')
//             ->add('dateEnd')
//            ->add('frequence')
//             ->add('valid')
//            ->add('comment')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
//             'data_class' => Event::class,
        ]);
    }
}
