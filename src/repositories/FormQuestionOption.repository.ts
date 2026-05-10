import { CreationAttributes, Transaction } from 'sequelize';

import FormQuestionOption from '../db/models/FormQuestionOption.model';
import BaseRepository from './Base.repository';

class FormQuestionOptionRepository extends BaseRepository<FormQuestionOption> {
    constructor() {
        super(FormQuestionOption);
    }

    async createBulk(data: CreationAttributes<FormQuestionOption>[], transaction: Transaction): Promise<void> {
        await this.model.bulkCreate(data, { transaction, ignoreDuplicates: true });
    }
}

export default FormQuestionOptionRepository;