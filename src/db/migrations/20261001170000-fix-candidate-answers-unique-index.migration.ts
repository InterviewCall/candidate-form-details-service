import { QueryInterface } from 'sequelize';

/*
 * The earlier migration 20260908130319 replaced candidate_answers.submission_id (CHAR -> BIGINT) by dropping and
 * re-adding the column. MySQL silently removes a dropped column from every index that contains it, so:
 *   UNIQUE (submission_id, question_id)  became  UNIQUE (question_id)           -> only ONE candidate could ever answer a question
 *   INDEX  (submission_id, question_key) became  INDEX  (question_key)
 * This restores both indexes to what they were meant to be.
 */
const UNIQUE_NAME = 'uq_candidate_answers_submission_id_question_id';
const KEY_INDEX_NAME = 'idx_candidate_answers_submission_question_key';

type IndexRow = { index_name: string, cols: string };

async function getIndexColumns(queryInterface: QueryInterface, indexName: string): Promise<string | null> {
    const [rows] = await queryInterface.sequelize.query(`
        SELECT INDEX_NAME AS index_name,
               GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = 'candidate_answers'
          AND INDEX_NAME = '${indexName}'
        GROUP BY INDEX_NAME;
    `);

    const row = (rows as IndexRow[])[0];
    return row ? row.cols : null;
}

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const uniqueCols = await getIndexColumns(queryInterface, UNIQUE_NAME);
        const keyIndexCols = await getIndexColumns(queryInterface, KEY_INDEX_NAME);

        if (uniqueCols !== 'submission_id,question_id') {
            if (uniqueCols !== null) {
                await queryInterface.sequelize.query(`ALTER TABLE candidate_answers DROP INDEX ${UNIQUE_NAME};`);
            }
            await queryInterface.sequelize.query(`
                ALTER TABLE candidate_answers
                ADD UNIQUE KEY ${UNIQUE_NAME} (submission_id, question_id);
            `);
        }

        if (keyIndexCols !== 'submission_id,question_key') {
            if (keyIndexCols !== null) {
                await queryInterface.sequelize.query(`ALTER TABLE candidate_answers DROP INDEX ${KEY_INDEX_NAME};`);
            }
            await queryInterface.sequelize.query(`
                ALTER TABLE candidate_answers
                ADD INDEX ${KEY_INDEX_NAME} (submission_id, question_key);
            `);
        }
    },

    async down(_queryInterface: QueryInterface): Promise<void> {
        // Nothing to undo: the previous state was a bug.
    }
};
