<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\ResultSetMapping;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\Query\ResultSetMappingBuilder;

/**
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventRepository extends ServiceEntityRepository
{
    private $em;

    public function __construct(RegistryInterface $registry,EntityManagerInterface $emanager)
    {
        parent::__construct($registry, Event::class);
        $this->em = $emanager;
    }

    // /**
    //  * @return Event[] Returns an array of Event objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->setQuery()
            ->setResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Event
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->setQuery()
            ->setOneOrNullResult()
        ;
    }
    */
    /**
     * @param string|null $term
     */
    public function getAllByDate(?string $term)
    {
        return $this->createQueryBuilder('e')
        ->orderBy('e.dateStart', 'DESC');
        //         ->setMaxResults(10)
        //         ->getQuery()
        //         ->getResult()
        //         ;
    }

    public function findByInTitle($parse){
        $qb = $this->createQueryBuilder('u')
        ->andWhere("u.title like :parse")
        ->setParameter('parse','%'.$parse.'%')
        ->orderBy('u.title','ASC')
        ->getQuery()
        ->getResult();

        return $qb;


    }

    public function findAllBetweenDates($dateMin,$dateMax,$userid): array
    {
        // automatically knows to select Products
        // the "p" is an alias you'll use in the rest of the query
        if ($userid === null) {
            $qb = $this->createQueryBuilder('p')
            ->andWhere('p.dateStart >= :dateMin')
            ->andWhere('p.dateStart <= :dateMax')
            ->setParameter('dateMin', $dateMin)
            ->setParameter('dateMax', $dateMax)
            ->orderBy('p.dateStart', 'ASC')
            ->getQuery();
        }
        else{
            $sql =  "select * from event where JSON_CONTAINS(usersid,'[".$userid."]')" ;

            $rsm = new ResultSetMappingBuilder($this->getEntityManager());
            $rsm->addEntityResult(Event::class, "m");

            // On mappe le nom de chaque colonne en base de données sur les attributs de nos entités
            foreach ($this->getClassMetadata()->fieldMappings as $obj) {
                $rsm->addFieldResult("m", $obj["columnName"], $obj["fieldName"]);
            }

            $stmt = $this->getEntityManager()->createNativeQuery($sql, $rsm);

            $stmt->execute();

            return $stmt->getResult();


        }
        return $qb->execute();

        // to set just one result:
        // $product = $qb->setMaxResults(1)->setOneOrNullResult();
    }
    
    /**
     * @param string|null $term
     */
    public function setAllByDate(?string $term)
    {
        return $this->createQueryBuilder('e')

        ->orderBy('e.dateStart', 'DESC');
//         ->setMaxResults(10)
//         ->setQuery()
//         ->setResult()
//         ;
    }

}
