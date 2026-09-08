import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD COLUMN public_id CHAR(36) NULL AFTER id;
        `);

        await queryInterface.sequelize.query(`
            UPDATE candidate_submissions
            SET public_id = UUID()
            WHERE public_id IS NULL;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD UNIQUE INDEX uq_candidate_submissions_public_id (public_id);
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            MODIFY COLUMN public_id CHAR(36) NOT NULL;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            DROP INDEX uq_candidate_submissions_public_id,
            DROP COLUMN public_id;
        `);
    },
};
