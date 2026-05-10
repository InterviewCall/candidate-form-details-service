import { CreationAttributes, Transaction } from 'sequelize';

import FormQuestion from '../db/models/FormQuestion.model';
import BaseRepository from './Base.repository';

class FormQuestionRepository extends BaseRepository<FormQuestion> {
    constructor() {
        super(FormQuestion);
    }

    async create(data: CreationAttributes<FormQuestion>, transaction?: Transaction): Promise<FormQuestion> {
        return await this.model.create(data, { transaction });
    }

    async findOneQuestionByFormIdAndQuestionKey(formId: number, questionKey: string, transaction: Transaction): Promise<FormQuestion | null> {
        const question = await this.model.findOne({
            where: {
                formId,
                questionKey
            },
            transaction
        });

        return question;
    }
}

export default FormQuestionRepository;