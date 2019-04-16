<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ORM\Entity(repositoryClass="App\Repository\MachineRepository")
 */
class Machine
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $imagefilename;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Maintenance", mappedBy="idMachine", cascade={"persist"})
     */
    private $maintenances;

   

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ModeleMachine", inversedBy="machines")
     * @ORM\JoinColumn(nullable=false)
     */
    private $modele;

  
    public function __construct()
    {
        $this->maintenances = new ArrayCollection();
    }

    public function getId(): ?int
    { 
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getImagefilename(): ?string
    {
        return $this->imagefilename;
    }

    public function setImagefilename(?string $imagefilename): self
    {
        $this->imagefilename = $imagefilename;

        return $this;
    }

    /**
     * @return Collection|Maintenance[]
     */
    public function getMaintenances(): Collection
    {
        return $this->maintenances;
    }

    public function addMaintenance(Maintenance $maintenance): self
    {
        if (!$this->maintenances->contains($maintenance)) {
            $this->maintenances[] = $maintenance;
            $maintenance->setIdMachine($this);
        }

        return $this;
    }

    public function removeMaintenance(Maintenance $maintenance): self
    {
        if ($this->maintenances->contains($maintenance)) {
            $this->maintenances->removeElement($maintenance);
            // set the owning side to null (unless already changed)
            if ($maintenance->getIdMachine() === $this) {
                $maintenance->setIdMachine(null);
            }
        }

        return $this;
    }

    

    public function getModele(): ?ModeleMachine
    {
        return $this->modele;
    }

    public function setModele(?ModeleMachine $modele): self
    {
        $this->modele = $modele;

        return $this;
    }
}
