import { CreationAttributes, InferAttributes, Transaction, WhereOptions } from 'sequelize';

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
}

export default FormStepRepository;