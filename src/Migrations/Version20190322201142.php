<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190322201142 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE proc DROP FOREIGN KEY proc_ibfk_1');
        $this->addSql('ALTER TABLE step DROP FOREIGN KEY step_ibfk_1');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, datecreation DATE DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('DROP TABLE machine');
        $this->addSql('DROP TABLE proc');
        $this->addSql('DROP TABLE step');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE machine (idMachine INT NOT NULL, repository VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, UNIQUE INDEX idMachine (idMachine)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE proc (idProc INT AUTO_INCREMENT NOT NULL, idMachine INT NOT NULL, title VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, INDEX idMachine (idMachine), PRIMARY KEY(idProc)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE step (idproc INT NOT NULL, nstep INT NOT NULL, title VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, description VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, posStep VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, posCam VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci, repo VARCHAR(255) DEFAULT \'\'images/step\'\' COLLATE latin1_swedish_ci, INDEX idproc (idproc)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE proc ADD CONSTRAINT proc_ibfk_1 FOREIGN KEY (idMachine) REFERENCES machine (idmachine) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE step ADD CONSTRAINT step_ibfk_1 FOREIGN KEY (idproc) REFERENCES proc (idproc) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('DROP TABLE user');
    }
}
