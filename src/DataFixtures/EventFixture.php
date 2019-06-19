<?php

namespace App\DataFixtures;


use App\Entity\Event;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Repository\UserRepository;
use App\Repository\MachineRepository;
use App\Repository\MaintenanceRepository;


class EventFixture extends BaseFixture
{
    private $uR;
    private $mR;
    private $mtR;
    
    
    public function __construct(UserRepository $uR, MachineRepository $mR, MaintenanceRepository $mtR)
    {
        $this->uR = $uR;
        $this->mR = $mR;
        $this->mtR = $mtR;
        
        
    }
    public function loadData(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $this->createMany(10,'event', function()
        {
            $event = new Event();
            $event->setTitle($this->faker->word);
            $event->setDescription('Ceci est la description');
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
            $event->setFrequence("7d");
            $event->setValid(false);
            return $event;
        });
       
        $manager->flush();
  
    }
}
