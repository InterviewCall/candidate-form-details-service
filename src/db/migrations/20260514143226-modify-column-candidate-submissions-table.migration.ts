import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN landing_page TEXT NULL DEFAULT NULL;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN submitted_at TIMESTAMP NULL DEFAULT NULL;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN status ENUM(
                'submission_pending',
                'booking_pending',
                'booked',
                'converted',
                'cancelled'
            ) NOT NULL;
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN status ENUM(
                'submitted',
                'booking_pending',
                'booked',
                'contacted',
                'qualified',
                'not_qualified',
                'converted'
            ) NOT NULL DEFAULT 'booking_pending';
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN submitted_at DATETIME NOT NULL;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN landing_page VARCHAR(255) NULL DEFAULT NULL;
        `);
    }
};
