import { CreationAttributes, InferAttributes, Op, Transaction } from 'sequelize';

import Candidate from '../db/models/Candidate.model';
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
    async markSubmissionAsBooked(id: string): Promise<void> {
        await this.model.update(
            {
                status: CandidateSubmissionStatus.BOOKED
            },
            {
                where: {
                    publicId: id
                }
            },
        );
    }

    async findAllBookingPendingSubmisssions(cutoffTime: Date): Promise<CandidateSubmission[]> {
        const submissions = await this.model.findAll({
            where: {
                status: CandidateSubmissionStatus.BOOKING_PENDING,
                reminderCount: {
                    [Op.lt]: 3
                },
                submittedAt: {
                    [Op.lte]: cutoffTime
                }
            },
            include: [{
                model: Candidate, 
                as: 'candidate',
                attributes: ['fullName', 'email', 'phone'],
                required: true
            }]
        });

        return submissions;
    }
    async updateReminderDetails(
        id: string,
        transaction?: Transaction
    ): Promise<boolean> {
        const [updatedRows] = await this.model.increment(
            'reminderCount',
            {
                by: 1,
                where: {
                    publicId: id,
                },
                transaction
            }
        );

        return updatedRows.length > 0;
    }

}

export default CandidateSubmissionRepository;