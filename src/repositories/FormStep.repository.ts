import { CreationAttributes, InferAttributes, Transaction, WhereOptions } from 'sequelize';

import FormQuestion from '../db/models/FormQuestion.model';
import FormStep from '../db/models/FormStep.model';
import BaseRepository from './Base.repository';

class FormStepRepository extends BaseRepository<FormStep> {
    constructor() {
        super(FormStep);
    }

    async create(payload: CreationAttributes<FormStep>, transaction?: Transaction): Promise<FormStep> {
        return this.model.create(payload, { transaction });
    }

    async findOne(where: WhereOptions<InferAttributes<FormStep>>, transaction?: Transaction): Promise<FormStep | null> {
        const formStep = await this.model.findOne({
            where,
            transaction
        });

        return formStep;
    }

    /**
     * The live steps of a form with their live questions, in display order. Used to list the questions a candidate
     * did NOT answer next to the ones they did.
     *
     *   SELECT st.id, st.step_no, st.title, q.id, q.question_key, q.question_text, q.sort_order
     *   FROM form_steps st
     *   LEFT JOIN form_questions q ON q.step_id = st.id AND q.is_active = 1 AND q.deleted_at IS NULL
     *   WHERE st.form_id = ? AND st.is_active = 1 AND st.deleted_at IS NULL
     *   ORDER BY st.step_no, q.sort_order
     */
    async findActiveStepsWithQuestions(formId: number): Promise<FormStep[]> {
        return await this.model.findAll({
            where: { formId, isActive: true, deletedAt: null },
            attributes: ['id', 'stepNo', 'title'],
            include: [
                {
                    model: FormQuestion,
                    as: 'questions',
                    required: false,
                    where: { isActive: true, deletedAt: null },
                    attributes: ['id', 'questionKey', 'questionText', 'sortOrder'],
                },
            ],
            order: [
                ['stepNo', 'ASC'],
                [{ model: FormQuestion, as: 'questions' }, 'sortOrder', 'ASC'],
                [{ model: FormQuestion, as: 'questions' }, 'id', 'ASC'],
            ],
        });
    }
}

export default FormStepRepository;