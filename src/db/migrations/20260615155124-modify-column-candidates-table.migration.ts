import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidates
            ADD COLUMN public_id CHAR(36) NOT NULL AFTER id,
            ADD UNIQUE INDEX uq_candidates_public_id (public_id);
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidates
            DROP INDEX uq_candidates_public_id,
            DROP COLUMN public_id;
        `);
    },
};