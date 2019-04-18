<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190402102812 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE etapes (id INT AUTO_INCREMENT NOT NULL, machine_id INT NOT NULL, maintenance_id INT NOT NULL, position DOUBLE PRECISION NOT NULL, camera DOUBLE PRECISION NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(800) NOT NULL, etape INT NOT NULL, INDEX IDX_E3443E17F6B75B26 (machine_id), INDEX IDX_E3443E17F6C202BC (maintenance_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE etapes ADD CONSTRAINT FK_E3443E17F6B75B26 FOREIGN KEY (machine_id) REFERENCES machine (id)');
        $this->addSql('ALTER TABLE etapes ADD CONSTRAINT FK_E3443E17F6C202BC FOREIGN KEY (maintenance_id) REFERENCES maintenance (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE etapes');
    }
}
