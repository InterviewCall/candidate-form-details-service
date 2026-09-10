import { CreationAttributes, InferAttributes, Op, Transaction } from 'sequelize';

import CandidateSubmission from '../db/models/CandidateSubmission.model';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
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
            },
            include: [
                {
                    association: 'candidate'
                }
            ]
        });

        return record;
    }

    async findBookingPendingSubmissionsOlderThan(minutes: number): Promise<CandidateSubmission[]> {
        const threshold = new Date(Date.now() - minutes * 60 * 1000);

        return await this.model.findAll({
            where: {
                status: CandidateSubmissionStatus.BOOKING_PENDING,
                createdAt: {
                    [Op.lte]: threshold
                }
            },
            include: [
                {
                    association: 'candidate'
                }
            ]
    });
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

    
}

export default CandidateSubmissionRepository;