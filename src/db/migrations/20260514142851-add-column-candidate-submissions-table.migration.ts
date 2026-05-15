import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD COLUMN referrer_url TEXT NULL DEFAULT NULL AFTER landing_page;
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            DROP COLUMN referrer_url;
        `);
    }
};
