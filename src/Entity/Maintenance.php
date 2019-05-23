<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MaintenanceRepository")
 */
class Maintenance
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
    private $nom;

//     /**
//      * @ORM\ManyToOne(targetEntity="App\Entity\Machine", inversedBy="maintenances", cascade={"persist"})
//      * @ORM\JoinColumn(nullable=false)
//      */
//     private $idMachine;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Etapes", mappedBy="maintenance", orphanRemoval=true, cascade={"persist"})
     */
    private $etapes;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $picturefile;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $picturefilename;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ModeleMachine", inversedBy="maintenances")
     * @ORM\JoinColumn(nullable=false)
     */
    private $modele;

    public function __construct()
    {
        $this->etapes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

//     public function getIdMachine(): ?machine
//     {
//         return $this->idMachine;
//     }

//     public function setIdMachine(?machine $idMachine): self
//     {
//         $this->idMachine = $idMachine;

//         return $this;
//     }

    /**
     * @return Collection|Etapes[]
     */
    public function getEtapes(): Collection
    {
        return $this->etapes;
    }

    public function addEtape(Etapes $etape): self
    {
        if (!$this->etapes->contains($etape)) {
            $this->etapes[] = $etape;
            $etape->setMaintenance($this);
        }

        return $this;
    }

    public function removeEtape(Etapes $etape): self
    {
        if ($this->etapes->contains($etape)) {
            $this->etapes->removeElement($etape);
            // set the owning side to null (unless already changed)
            if ($etape->getMaintenance() === $this) {
                $etape->setMaintenance(null);
            }
        }

        return $this;
    }

    public function getPicturefile(): ?string
    {
        return $this->picturefile;
    }

    public function setPicturefile(?string $picturefile): self
    {
        $this->picturefile = $picturefile;

        return $this;
    }

    public function getPicturefilename(): ?string
    {
        return $this->picturefilename;
    }

    public function setPicturefilename(?string $picturefilename): self
    {
        $this->picturefilename = $picturefilename;

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
