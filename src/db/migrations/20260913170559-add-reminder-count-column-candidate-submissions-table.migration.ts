import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD COLUMN reminder_count INT UNSIGNED NOT NULL DEFAULT 0;
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            DROP COLUMN reminder_count;
        `);
    }
};
