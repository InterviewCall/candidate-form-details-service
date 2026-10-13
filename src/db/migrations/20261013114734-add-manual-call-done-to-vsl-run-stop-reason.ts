import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE vsl_runs
            MODIFY COLUMN stop_reason ENUM(
                'form_submitted',
                'booked',
                'converted',
                'submission_cancelled',
                'opted_out',
                'unsubscribed',
                'not_interested',
                'won',
                'enrolled',
                'later_stage',
                'manual_call_done',
                'other'
            ) NULL DEFAULT NULL;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        // Preserve existing stopped runs before removing the enum value.
        await queryInterface.sequelize.query(`
            UPDATE vsl_runs
            SET stop_reason = 'other'
            WHERE stop_reason = 'manual_call_done';
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE vsl_runs
            MODIFY COLUMN stop_reason ENUM(
                'form_submitted',
                'booked',
                'converted',
                'submission_cancelled',
                'opted_out',
                'unsubscribed',
                'not_interested',
                'won',
                'enrolled',
                'later_stage',
                'other'
            ) NULL DEFAULT NULL;
        `);
    },
};