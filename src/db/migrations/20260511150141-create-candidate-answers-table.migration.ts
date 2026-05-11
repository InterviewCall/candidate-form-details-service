import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS candidate_answers (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

                submission_id CHAR(36) NOT NULL,
                question_id INT UNSIGNED NOT NULL,
                question_key VARCHAR(100) NOT NULL,

                answer_text TEXT NULL DEFAULT NULL,
                answer_number DECIMAL(12, 2) NULL DEFAULT NULL,
                answer_json JSON NULL DEFAULT NULL,

                selected_option_id INT UNSIGNED NULL DEFAULT NULL,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                CONSTRAINT fk_candidate_answers_submission_id
                    FOREIGN KEY (submission_id)
                    REFERENCES candidate_submissions(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                CONSTRAINT fk_candidate_answers_question_id
                    FOREIGN KEY (question_id)
                    REFERENCES form_questions(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                CONSTRAINT fk_candidate_answers_selected_option_id
                    FOREIGN KEY (selected_option_id)
                    REFERENCES form_question_options(id)
                    ON UPDATE CASCADE
                    ON DELETE SET NULL,

                UNIQUE KEY uq_candidate_answers_submission_id_question_id (submission_id, question_id),

                INDEX idx_candidate_answers_submission_id (submission_id),
                INDEX idx_candidate_answers_question_id (question_id),
                INDEX idx_candidate_answers_question_key (question_key),
                INDEX idx_candidate_answers_selected_option_id (selected_option_id),
                INDEX idx_candidate_answers_submission_question_key (submission_id, question_key)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS candidate_answers;
        `);
    }
};