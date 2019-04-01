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
            $values[] = $this->faker->numberBetween(1,5);
            $event->setUsersid($values);
            $values = array();
            $values[] = $this->faker->numberBetween(1,5);
            $event->setMachinesid($values);
            $date = new \DateTime();           
            $jour = $this->faker->numberBetween(1,1000);
            $date->modify('+'.$jour.' day'); 
            $event->setDateStart($date);
            $event->setFrequence($this->faker->randomDigit);
            return $event;
        });
       
        $manager->flush();
  
    }
}
