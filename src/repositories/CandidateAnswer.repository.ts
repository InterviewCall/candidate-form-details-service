import { CreationAttributes, Transaction } from 'sequelize';

import CandidateAnswer from '../db/models/CandidateAnswer.model';
import BaseRepository from './Base.repository';

class CandidateAnswerRepository extends BaseRepository<CandidateAnswer> {
    constructor() {
        super(CandidateAnswer);
    }

    async createBulk(data: CreationAttributes<CandidateAnswer>[], transaction: Transaction): Promise<void> {
        // No INSERT IGNORE: a bad row must fail loudly (and roll the submission back) instead of being skipped silently.
        // If the same submission is sent again, the existing answers are updated rather than dropped.
        await this.model.bulkCreate(data, {
            updateOnDuplicate: ['questionKey', 'answerText', 'answerNumber', 'answerJson', 'selectedOptionId'],
            transaction
        });
    }
}

export default CandidateAnswerRepository;