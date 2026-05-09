import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS form_question_options (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                question_id INT UNSIGNED NOT NULL,
                option_label VARCHAR(255) NOT NULL,
                option_value VARCHAR(150) NOT NULL,
                score INT NULL DEFAULT NULL,
                sort_order INT UNSIGNED NOT NULL DEFAULT 1,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                CONSTRAINT fk_form_question_options_question_id
                    FOREIGN KEY (question_id)
                    REFERENCES form_questions(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                UNIQUE KEY uq_form_question_options_question_id_option_value (question_id, option_value),

                INDEX idx_form_question_options_question_id (question_id),
                INDEX idx_form_question_options_question_id_sort_order (question_id, sort_order),
                INDEX idx_form_question_options_is_active (is_active)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS form_question_options;
        `);
    }
};
