<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190523141124 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE maintenance ADD modele_id INT NOT NULL');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E9AC14B70A FOREIGN KEY (modele_id) REFERENCES modele_machine (id)');
        $this->addSql('CREATE INDEX IDX_2F84F8E9AC14B70A ON maintenance (modele_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE maintenance DROP FOREIGN KEY FK_2F84F8E9AC14B70A');
        $this->addSql('DROP INDEX IDX_2F84F8E9AC14B70A ON maintenance');
        $this->addSql('ALTER TABLE maintenance DROP modele_id');
    }
}
