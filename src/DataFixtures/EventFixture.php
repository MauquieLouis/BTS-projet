<?php

namespace App\DataFixtures;

use App\Entity\Event;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;


class EventFixture extends BaseFixture
{
    public function loadData(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $this->createMany(20,'event', function()
        {
            $event = new Event();
            $event->setTitle($this->faker->title);
            $event->setDescription($this->faker->text);
            $values = array();
            for ($i=0; $i < $this->faker->randomDigit; $i++) {
                // get a random digit, but always a new one, to avoid duplicates
                $values []= $this->faker->unique()->randomDigit;
            }
            $event->setUsersid($values);
            $values = array();
            for ($i=0; $i < $this->faker->randomDigit; $i++) {
                // get a random digit, but always a new one, to avoid duplicates
                $values []=  $this->faker->unique()->randomDigit;
            }
            $event->setMachinesid($values);
            
            $event->setDateStart($this->faker->dateTime);
            $event->setFrequence($this->faker->randomDigit);
            return $event;
        });
       
        $manager->flush();
  
    }
}
