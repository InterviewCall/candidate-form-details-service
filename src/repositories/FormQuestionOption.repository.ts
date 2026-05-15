import { CreationAttributes, Op, Transaction } from 'sequelize';

import FormQuestionOption from '../db/models/FormQuestionOption.model';
import BaseRepository from './Base.repository';

class FormQuestionOptionRepository extends BaseRepository<FormQuestionOption> {
    constructor() {
        super(FormQuestionOption);
    }

    async createBulk(data: CreationAttributes<FormQuestionOption>[], transaction: Transaction): Promise<void> {
        await this.model.bulkCreate(data, { transaction, ignoreDuplicates: true });
    }

    async getAllScoresByOptionId(optionIds: number[], transaction: Transaction): Promise<number[]> {
        const scores = await this.model.findAll({
            where: {
                id: {
                    [Op.in]: optionIds
                }
            },
            attributes: ['score'],
            transaction
        });

        return scores.map((score) => Number(score.score ?? 0));
    }
}

export default FormQuestionOptionRepository;