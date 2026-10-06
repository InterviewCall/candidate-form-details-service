import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            DROP INDEX uq_candidate_answers_submission_id_question_id,
            ADD UNIQUE KEY uq_candidate_answers_submission_id_question_id
                (submission_id, question_id);
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE candidate_answers
            DROP INDEX uq_candidate_answers_submission_id_question_id,
            ADD UNIQUE KEY uq_candidate_answers_submission_id_question_id
                (question_id);
        `);
    },
};