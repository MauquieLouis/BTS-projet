<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixture extends BaseFixture
{
    private $passwordEncoder;
    
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
    
    public function loadData(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $this->createMany(30,'main_users', function($i)
        {
            $user = new User();
            $user->setEmail(sprintf('compte%d@farella.fr', $i));
            $user->setPrenom($this->faker->firstName);
            $user->setNom($this->faker->lastName);
            $user->setPassword($this->passwordEncoder->encodePassword($user,'farella'));
            $user->setRoles(['ROLE_USER']);
            $user->setDatecreation(new \DateTime()); 
            return $user;
        });
        $this->createMany(20,'new_users', function($i)
        {
            $user = new User();
            $user->setEmail(sprintf('nouveau%d@farella.fr', $i));
            $user->setPrenom($this->faker->firstName);
            $user->setNom($this->faker->lastName);
            $user->setPassword($this->passwordEncoder->encodePassword($user,'farella'));
            $user->setDatecreation(new \DateTime());
            return $user;
        });
        $this->createMany(8,'admin_users', function($i)
        {
            $user = new User();
            $user->setEmail(sprintf('admin%d@farella.fr', $i));
            $user->setPrenom($this->faker->firstName);
            $user->setNom($this->faker->lastName);
            $user->setPassword($this->passwordEncoder->encodePassword($user,'admin'));
            $user->setRoles(['ROLE_ADMIN','ROLE_USER']);
            $user->setDatecreation(new \DateTime()); 
            return $user;
        });
        
        $manager->flush();
    }
}
