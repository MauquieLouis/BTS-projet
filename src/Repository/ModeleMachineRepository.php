<?php

namespace App\Repository;

use App\Entity\ModeleMachine;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ModeleMachine|null find($id, $lockMode = null, $lockVersion = null)
 * @method ModeleMachine|null findOneBy(array $criteria, array $orderBy = null)
 * @method ModeleMachine[]    findAll()
 * @method ModeleMachine[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ModeleMachineRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ModeleMachine::class);
    }

    // /**
    //  * @return ModeleMachine[] Returns an array of ModeleMachine objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ModeleMachine
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
