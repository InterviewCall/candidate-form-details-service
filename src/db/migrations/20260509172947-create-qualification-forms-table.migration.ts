import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS qualification_forms (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            slug VARCHAR(150) NOT NULL UNIQUE,
            segment_key VARCHAR(80) NOT NULL,
            description TEXT NULL DEFAULT NULL,
            version INT UNSIGNED NOT NULL DEFAULT 1,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL DEFAULT NULL,

            INDEX idx_qualification_forms_segment_key (segment_key),
            INDEX idx_qualification_forms_is_active (is_active),
            INDEX idx_qualification_forms_created_at (created_at)
          );
      `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS qualification_forms;
      `);
    }
};
