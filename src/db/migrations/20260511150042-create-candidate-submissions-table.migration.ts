import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS candidate_submissions (
                id CHAR(36) PRIMARY KEY,
                candidate_id BIGINT UNSIGNED NOT NULL,
                form_id INT UNSIGNED NOT NULL,

                source VARCHAR(100) NULL DEFAULT NULL,
                landing_page VARCHAR(255) NULL DEFAULT NULL,

                utm_source VARCHAR(100) NULL DEFAULT NULL,
                utm_medium VARCHAR(100) NULL DEFAULT NULL,
                utm_campaign VARCHAR(150) NULL DEFAULT NULL,
                utm_content VARCHAR(150) NULL DEFAULT NULL,
                utm_term VARCHAR(150) NULL DEFAULT NULL,

                status ENUM(
                    'submitted',
                    'booking_pending',
                    'booked',
                    'contacted',
                    'qualified',
                    'not_qualified',
                    'converted'
                ) NOT NULL DEFAULT 'booking_pending',

                lead_score INT UNSIGNED NULL DEFAULT NULL,

                lead_temperature ENUM(
                    'hot',
                    'warm',
                    'cold'
                ) NULL DEFAULT NULL,

                submitted_at DATETIME NOT NULL,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,

                CONSTRAINT fk_candidate_submissions_candidate_id
                    FOREIGN KEY (candidate_id)
                    REFERENCES candidates(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                CONSTRAINT fk_candidate_submissions_form_id
                    FOREIGN KEY (form_id)
                    REFERENCES qualification_forms(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                INDEX idx_candidate_submissions_candidate_id (candidate_id),
                INDEX idx_candidate_submissions_form_id (form_id),
                INDEX idx_candidate_submissions_status (status),
                INDEX idx_candidate_submissions_submitted_at (submitted_at),
                INDEX idx_candidate_submissions_lead_temperature (lead_temperature),
                INDEX idx_candidate_submissions_lead_score (lead_score),
                INDEX idx_candidate_submissions_candidate_id_form_id (candidate_id, form_id)
            );
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS candidate_submissions;
        `);
    }
};