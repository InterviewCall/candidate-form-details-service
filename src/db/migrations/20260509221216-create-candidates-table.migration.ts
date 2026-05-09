import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(150) NOT NULL,
                email VARCHAR(150) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                INDEX idx_candidates_email (email),
                INDEX idx_candidates_phone (phone),
                INDEX idx_candidates_created_at (created_at)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS candidates;
        `);
    }
};
