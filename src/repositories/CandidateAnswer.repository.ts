import { CreationAttributes, Op, Transaction } from 'sequelize';

import CandidateAnswer from '../db/models/CandidateAnswer.model';
import FormQuestion from '../db/models/FormQuestion.model';
import FormQuestionOption from '../db/models/FormQuestionOption.model';
import FormStep from '../db/models/FormStep.model';
import BaseRepository from './Base.repository';

class CandidateAnswerRepository extends BaseRepository<CandidateAnswer> {
    constructor() {
        super(CandidateAnswer);
    }

    async createBulk(data: CreationAttributes<CandidateAnswer>[], transaction: Transaction): Promise<void> {
        await this.model.bulkCreate(data, { 
            ignoreDuplicates: true, 
            transaction
        });
    }

    /**
     * The answers to the given question keys for several submissions at once, with the question's options so a stored
     * option value can be shown as its label. Nothing is filtered on the question being active, as in findAllForSubmission.
     *
     *   SELECT a.submission_id, a.question_key, a.answer_text, a.answer_number, a.answer_json, a.selected_option_id, q.question_type, ...
     *   FROM candidate_answers a
     *   JOIN form_questions q ON q.id = a.question_id
     *   LEFT JOIN form_question_options so ON so.id = a.selected_option_id
     *   LEFT JOIN form_question_options o  ON o.question_id = q.id
     *   WHERE a.submission_id IN (?) AND a.question_key IN (?) AND a.deleted_at IS NULL
     */
    async findForSubmissionsByQuestionKeys(submissionIds: number[], questionKeys: string[]): Promise<CandidateAnswer[]> {
        if (submissionIds.length === 0 || questionKeys.length === 0) {
            return [];
        }

        return await this.model.findAll({
            where: { submissionId: { [Op.in]: submissionIds }, questionKey: { [Op.in]: questionKeys }, deletedAt: null },
            attributes: ['id', 'submissionId', 'questionId', 'questionKey', 'answerText', 'answerNumber', 'answerJson', 'selectedOptionId'],
            include: [
                {
                    model: FormQuestion,
                    as: 'question',
                    required: true,
                    attributes: ['id', 'questionType'],
                    include: [
                        {
                            model: FormQuestionOption,
                            as: 'options',
                            required: false,
                            attributes: ['id', 'optionLabel', 'optionValue'],
                        },
                    ],
                },
                {
                    model: FormQuestionOption,
                    as: 'selectedOption',
                    required: false,
                    attributes: ['id', 'optionLabel', 'optionValue'],
                },
            ],
            order: [['id', 'ASC']],
        });
    }

    /**
     * Every saved answer of one submission, joined with what is needed to show it in the admin panel:
     * the question (text, type, step) and the options, so a stored option value can be shown as its label.
     *
     * Soft-deleted or deactivated questions and options are deliberately NOT filtered out: the candidate answered them
     * when they were live, and the admin must still see that answer.
     *
     *   SELECT a.question_key, a.answer_text, a.answer_number, a.answer_json, a.selected_option_id,
     *          q.question_text, q.question_type, q.sort_order, st.step_no, st.title,
     *          so.option_label, so.option_value, so.score,
     *          o.option_label, o.option_value                -- all options of the question (label lookup by value)
     *   FROM candidate_answers a
     *   JOIN form_questions q                ON q.id = a.question_id
     *   JOIN form_steps st                   ON st.id = q.step_id
     *   LEFT JOIN form_question_options so   ON so.id = a.selected_option_id
     *   LEFT JOIN form_question_options o    ON o.question_id = q.id
     *   WHERE a.submission_id = ? AND a.deleted_at IS NULL
     */
    async findAllForSubmission(submissionId: number): Promise<CandidateAnswer[]> {
        return await this.model.findAll({
            where: { submissionId, deletedAt: null },
            attributes: ['id', 'questionId', 'questionKey', 'answerText', 'answerNumber', 'answerJson', 'selectedOptionId'],
            include: [
                {
                    model: FormQuestion,
                    as: 'question',
                    required: true,
                    attributes: ['id', 'stepId', 'questionKey', 'questionText', 'questionType', 'sortOrder'],
                    include: [
                        {
                            model: FormStep,
                            as: 'step',
                            required: true,
                            attributes: ['id', 'stepNo', 'title'],
                        },
                        {
                            model: FormQuestionOption,
                            as: 'options',
                            required: false,
                            attributes: ['id', 'optionLabel', 'optionValue', 'score'],
                        },
                    ],
                },
                {
                    model: FormQuestionOption,
                    as: 'selectedOption',
                    required: false,
                    attributes: ['id', 'optionLabel', 'optionValue', 'score'],
                },
            ],
        });
    }
}

export default CandidateAnswerRepository;