<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EtapesRepository")
 */
class Etapes
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $position;

    /**
     * @ORM\Column(type="float")
     */
    private $camera;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=800)
     */
    private $description;

    /**
     * @ORM\Column(type="integer")
     */
    private $etape;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\machine")
     * @ORM\JoinColumn(nullable=false)
     */
    private $machine;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\maintenance", inversedBy="etapes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $maintenance;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPosition(): ?float
    {
        return $this->position;
    }

    public function setPosition(float $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function getCamera(): ?float
    {
        return $this->camera;
    }

    public function setCamera(float $camera): self
    {
        $this->camera = $camera;

        return $this;
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

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getEtape(): ?int
    {
        return $this->etape;
    }

    public function setEtape(int $etape): self
    {
        $this->etape = $etape;

        return $this;
    }

    public function getMachine(): ?machine
    {
        return $this->machine;
    }

    public function setMachine(?machine $machine): self
    {
        $this->machine = $machine;

        return $this;
    }

    public function getMaintenance(): ?maintenance
    {
        return $this->maintenance;
    }

    public function setMaintenance(?maintenance $maintenance): self
    {
        $this->maintenance = $maintenance;

        return $this;
    }
}
