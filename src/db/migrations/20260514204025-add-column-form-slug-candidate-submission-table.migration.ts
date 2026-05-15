import { QueryInterface } from 'sequelize';

export default {
    async up (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD COLUMN form_slug VARCHAR(100) NOT NULL AFTER form_id;
        `);
    },

    async down (queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            DROP COLUMN form_slug;
        `);
    }
};
