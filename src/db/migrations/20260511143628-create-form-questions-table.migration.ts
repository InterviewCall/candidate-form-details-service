import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS form_questions (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                form_id INT UNSIGNED NOT NULL,
                step_id INT UNSIGNED NOT NULL,
                question_key VARCHAR(100) NOT NULL,
                question_text TEXT NOT NULL,
                placeholder TEXT NULL DEFAULT NULL,

                question_type ENUM(
                    'text',
                    'email',
                    'phone',
                    'number',
                    'select',
                    'radio',
                    'checkbox',
                    'textarea'
                ) NOT NULL,

                is_required BOOLEAN NOT NULL DEFAULT TRUE,
                sort_order INT UNSIGNED NOT NULL DEFAULT 1,
                validation_rules JSON NULL DEFAULT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                CONSTRAINT fk_form_questions_form_id
                    FOREIGN KEY (form_id)
                    REFERENCES qualification_forms(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                CONSTRAINT fk_form_questions_step_id
                    FOREIGN KEY (step_id)
                    REFERENCES form_steps(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                UNIQUE KEY uq_form_questions_form_id_question_key (form_id, question_key),

                INDEX idx_form_questions_form_id (form_id),
                INDEX idx_form_questions_step_id (step_id),
                INDEX idx_form_questions_form_id_step_id (form_id, step_id),
                INDEX idx_form_questions_form_id_step_id_sort_order (form_id, step_id, sort_order),
                INDEX idx_form_questions_question_type (question_type),
                INDEX idx_form_questions_is_active (is_active),
                INDEX idx_form_questions_created_at (created_at)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS form_questions;
        `);
    }
};
