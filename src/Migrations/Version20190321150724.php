<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190321150724 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE machine (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, imagefilename VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE event ADD title VARCHAR(255) NOT NULL, ADD description VARCHAR(255) DEFAULT NULL, ADD usersid LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', ADD machinesid LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:array)\', ADD date_start DATE NOT NULL, ADD frequence INT NOT NULL, DROP idevent, DROP idmachine, DROP idaction, DROP describeaction, DROP datestart, CHANGE dateend date_end DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE machine');
        $this->addSql('ALTER TABLE event ADD idmachine INT DEFAULT NULL, ADD idaction INT NOT NULL, ADD describeaction VARCHAR(1024) DEFAULT NULL COLLATE utf8mb4_unicode_ci, ADD datestart DATETIME NOT NULL, DROP title, DROP description, DROP usersid, DROP machinesid, DROP date_start, CHANGE frequence idevent INT NOT NULL, CHANGE date_end dateend DATETIME DEFAULT NULL');
    }
}
