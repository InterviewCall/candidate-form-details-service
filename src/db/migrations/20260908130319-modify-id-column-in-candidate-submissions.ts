import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // Create temporary integer ID
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            ADD COLUMN new_id BIGINT UNSIGNED NULL;
        `);

        // Generate new integer IDs
        await queryInterface.sequelize.query(`
            SET @row_number = 0;
        `);

        await queryInterface.sequelize.query(`
            UPDATE candidate_submissions
            SET new_id = (@row_number := @row_number + 1)
            ORDER BY id;
        `);

        // Create temporary submission ID in answers
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            ADD COLUMN new_submission_id BIGINT UNSIGNED NULL;
        `);

        // Map old UUID IDs to new integer IDs
        await queryInterface.sequelize.query(`
            UPDATE candidate_answers ca
            JOIN candidate_submissions cs
                ON ca.submission_id = cs.id
            SET ca.new_submission_id = cs.new_id;
        `);

        // Remove foreign key
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            DROP FOREIGN KEY fk_candidate_answers_submission_id;
        `);

        // Replace candidate_submissions.id
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_submissions
            DROP PRIMARY KEY,
            DROP COLUMN id,
            CHANGE COLUMN new_id id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ADD PRIMARY KEY (id);
        `);

        // Replace submission_id with new integer ID
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            DROP COLUMN submission_id,
            CHANGE COLUMN new_submission_id submission_id BIGINT UNSIGNED NOT NULL;
        `);

        // Add foreign key again
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            ADD CONSTRAINT fk_candidate_answers_submission_id
            FOREIGN KEY (submission_id)
            REFERENCES candidate_submissions(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
        `);
    },

    async down(_queryInterface: QueryInterface): Promise<void> {
        throw new Error(
            'Cannot automatically rollback because the original UUID IDs have been replaced.'
        );
    },
};