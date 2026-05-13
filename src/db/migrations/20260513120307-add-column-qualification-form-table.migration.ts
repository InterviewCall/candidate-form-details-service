import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const tableDefinition = await queryInterface.describeTable('qualification_forms');

        if (!tableDefinition.title) {
            await queryInterface.sequelize.query(`
                ALTER TABLE qualification_forms
                ADD COLUMN title TEXT NULL AFTER segment_key;
            `);
        }

        const updatedTableDefinition = await queryInterface.describeTable('qualification_forms');

        if (!updatedTableDefinition.sub_title) {
            await queryInterface.sequelize.query(`
                ALTER TABLE qualification_forms
                ADD COLUMN sub_title TEXT NULL AFTER title;
            `);
        }

        await queryInterface.sequelize.query(`
            UPDATE qualification_forms
            SET
                title = COALESCE(NULLIF(title, ''), name),
                sub_title = COALESCE(NULLIF(sub_title, ''), description, name);
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE qualification_forms
            MODIFY COLUMN title TEXT NOT NULL AFTER segment_key,
            MODIFY COLUMN sub_title TEXT NOT NULL AFTER title;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        const tableDefinition = await queryInterface.describeTable('qualification_forms');

        if (tableDefinition.sub_title) {
            await queryInterface.sequelize.query(`
                ALTER TABLE qualification_forms
                DROP COLUMN sub_title;
            `);
        }

        const updatedTableDefinition = await queryInterface.describeTable('qualification_forms');

        if (updatedTableDefinition.title) {
            await queryInterface.sequelize.query(`
                ALTER TABLE qualification_forms
                DROP COLUMN title;
            `);
        }
    }
};