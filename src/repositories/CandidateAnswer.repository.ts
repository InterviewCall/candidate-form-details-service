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

    async findAllBySubmissionId(submissionId: number): Promise<CandidateAnswer[]> {
        const answers = await this.model.findAll({
            where: {
                submissionId
            },
            include: [
                {
                    association: 'question'
                },
                {
                    association: 'selectedOption'
                }
            ]
        });

        return answers;
    }
}

export default CandidateAnswerRepository;