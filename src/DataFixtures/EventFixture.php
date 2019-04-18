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
        $this->createMany(5,'event', function()
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
            $jour = $this->faker->numberBetween(1,100);
            $date->modify('+'.$jour.' day'); 
            $event->setDateStart($date);
            $event->setFrequence(7);
            return $event;
        });
       
        $manager->flush();
  
    }
}
