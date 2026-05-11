import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS form_steps (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                form_id INT UNSIGNED NOT NULL,
                step_no INT UNSIGNED NOT NULL,
                title TEXT NOT NULL,
                helper_text TEXT NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                CONSTRAINT fk_form_steps_form_id
                    FOREIGN KEY (form_id)
                    REFERENCES qualification_forms(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                UNIQUE KEY uq_form_steps_form_id_step_no (form_id, step_no),

                INDEX idx_form_steps_form_id (form_id),
                INDEX idx_form_steps_form_id_is_active (form_id, is_active),
                INDEX idx_form_steps_form_id_step_no (form_id, step_no),
                INDEX idx_form_steps_is_active (is_active),
                INDEX idx_form_steps_created_at (created_at)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS form_steps;
        `);
    }
};
