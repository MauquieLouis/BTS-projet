<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ModeleMachineRepository")
 */
class ModeleMachine
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceAvant;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceArriere;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceGauche;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceDroite;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceHaut;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $faceBas;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Machine", mappedBy="modele", orphanRemoval=true)
     */
    private $machines;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Maintenance", mappedBy="modele", orphanRemoval=true)
     */
    private $maintenances;

    public function __construct()
    {
        $this->machines = new ArrayCollection();
        $this->maintenances = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFaceAvant(): ?string
    {
        return $this->faceAvant;
    }

    public function setFaceAvant(?string $faceAvant): self
    {
        $this->faceAvant = $faceAvant;

        return $this;
    }

    public function getFaceArriere(): ?string
    {
        return $this->faceArriere;
    }

    public function setFaceArriere(?string $faceArriere): self
    {
        $this->faceArriere = $faceArriere;

        return $this;
    }

    public function getFaceGauche(): ?string
    {
        return $this->faceGauche;
    }

    public function setFaceGauche(?string $faceGauche): self
    {
        $this->faceGauche = $faceGauche;

        return $this;
    }

    public function getFaceDroite(): ?string
    {
        return $this->faceDroite;
    }

    public function setFaceDroite(?string $faceDroite): self
    {
        $this->faceDroite = $faceDroite;

        return $this;
    }

    public function getFaceHaut(): ?string
    {
        return $this->faceHaut;
    }

    public function setFaceHaut(?string $faceHaut): self
    {
        $this->faceHaut = $faceHaut;

        return $this;
    }

    public function getFaceBas(): ?string
    {
        return $this->faceBas;
    }

    public function setFaceBas(?string $faceBas): self
    {
        $this->faceBas = $faceBas;

        return $this;
    }

    /**
     * @return Collection|Machine[]
     */
    public function getMachines(): Collection
    {
        return $this->machines;
    }

    public function addMachine(Machine $machine): self
    {
        if (!$this->machines->contains($machine)) {
            $this->machines[] = $machine;
            $machine->setModele($this);
        }

        return $this;
    }

    public function removeMachine(Machine $machine): self
    {
        if ($this->machines->contains($machine)) {
            $this->machines->removeElement($machine);
            // set the owning side to null (unless already changed)
            if ($machine->getModele() === $this) {
                $machine->setModele(null);
            }
        }

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

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
            $maintenance->setModele($this);
        }

        return $this;
    }

    public function removeMaintenance(Maintenance $maintenance): self
    {
        if ($this->maintenances->contains($maintenance)) {
            $this->maintenances->removeElement($maintenance);
            // set the owning side to null (unless already changed)
            if ($maintenance->getModele() === $this) {
                $maintenance->setModele(null);
            }
        }

        return $this;
    }
}
