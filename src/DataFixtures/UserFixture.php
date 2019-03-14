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
        $this->createMany(5,'main_users', function($i)
        {
            $user = new User();
            $user->setEmail(sprintf('compte%d@farella.fr', $i));
            $user->setPrenom($this->faker->firstName);
            $user->setNom($this->faker->lastName);
            $user->setPassword($this->passwordEncoder->encodePassword($user,'farella'));
            return $user;
        });
        
        $manager->flush();
    }
}
