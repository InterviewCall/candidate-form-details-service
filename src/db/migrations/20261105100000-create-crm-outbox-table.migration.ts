import { QueryInterface } from 'sequelize';

// Events waiting to be sent to the CRM. A row is written in the same transaction as the funnel step it describes,
// so a step that is saved is never lost even if the CRM is down. The payload is built when the row is sent.
export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            CREATE TABLE crm_outbox (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                event_id VARCHAR(100) NOT NULL,
                event_type VARCHAR(40) NOT NULL,
                submission_public_id CHAR(36) NOT NULL,
                status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
                attempts INT UNSIGNED NOT NULL DEFAULT 0,
                next_attempt_at DATETIME(3) NOT NULL,
                last_error VARCHAR(500) NULL,
                sent_at DATETIME(3) NULL,
                created_at DATETIME(3) NOT NULL,
                updated_at DATETIME(3) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uq_crm_outbox_event_id (event_id),
                KEY idx_crm_outbox_due (status, next_attempt_at),
                KEY idx_crm_outbox_submission (submission_public_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS crm_outbox;');
    },
};
