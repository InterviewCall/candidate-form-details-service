import { CreationAttributes, InferAttributes, Transaction } from 'sequelize';

import CandidateSubmission from '../db/models/CandidateSubmission.model';
import BaseRepository from './Base.repository';

class CandidateSubmissionRepository extends BaseRepository<CandidateSubmission> {
    constructor() {
        super(CandidateSubmission);
    }

    async create(data: CreationAttributes<CandidateSubmission>, transaction?: Transaction): Promise<CandidateSubmission> {
        return await this.model.create(data, { transaction });
    }
    async findById(id: string): Promise<CandidateSubmission | null> {
        const record = await this.model.findOne({
            where: {
                publicId: id
            }
        });

        return record;
    }


    async markSubmissionAsCompleted(id: string, data: Partial<InferAttributes<CandidateSubmission>>, transaction: Transaction): Promise<void> {
        await this.model.update(
            {
                status: data.status,
                submittedAt: data.submittedAt,
                leadScore: data.leadScore,
                leadTemperature: data.leadTemperature
            },
            {
                where: {
                    publicId: id
                },
                transaction
            },
        );
    }

    async findById(id: string): Promise<CandidateSubmission | null> {
    const record = await this.model.findOne({
        where: {
            publicId: id
        }
    });

    return record;
}
}

export default CandidateSubmissionRepository;