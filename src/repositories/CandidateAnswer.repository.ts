import { CreationAttributes, Transaction } from 'sequelize';

import CandidateAnswer from '../db/models/CandidateAnswer.model';
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
}

export default CandidateAnswerRepository;