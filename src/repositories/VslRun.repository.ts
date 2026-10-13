import { col, CreationAttributes, fn, Op, Transaction, where } from 'sequelize';
import Candidate from '../db/models/Candidate.model';
import VslRun from '../db/models/VslRun.model';
import { VslRunStatus } from '../utils/enums/VslRunStatus';
import BaseRepository from './Base.repository';

class VslRunRepository extends BaseRepository<VslRun> {
    // Initializes the repository with the VslRun model.
    constructor() {
        super(VslRun);
    }

    // Finds an existing VSL run using its submission ID.
    
    async findBySubmissionId(submissionId: number,transaction?: Transaction,lockForUpdate = false,): Promise<VslRun | null> {
        return await this.model.findOne({
            where: { submissionId },
            transaction,
            ...(transaction && lockForUpdate
                ? { lock: transaction.LOCK.UPDATE }
                : {}),
        });
    }
    
    async saveManualCallRun(run: VslRun,transaction: Transaction,): Promise<VslRun> {
        return await run.save({ transaction });
    }


    // Finds an active VSL run for the given candidate.
    async findActiveByCandidateId(candidateId: number,transaction?: Transaction): Promise<VslRun | null> {
        return await this.model.findOne({
            where: {
                candidateId,
                status: VslRunStatus.ACTIVE,
            },
            transaction,
        });
    }
    
    // Finds any existing VSL run associated with the same normalized email.
    async findByCandidateEmail(email: string,transaction?: Transaction): Promise<VslRun | null> {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            return null;
        }

        return await this.model.findOne({
            include: [
                {
                    model: Candidate,
                    as: 'candidate',
                    attributes: [],
                    required: true,
                    where: where(
                        fn('LOWER', fn('TRIM', col('candidate.email'))),
                        Op.eq,
                        normalizedEmail,
                    ),
                },
            ],
            transaction,
        });
    }


    // Creates a VSL run for a submission if one does not already exist.
    async findOrCreateBySubmission(data: CreationAttributes<VslRun>,transaction?: Transaction): Promise<[VslRun, boolean]> {
        return await this.model.findOrCreate({
            where: {
                submissionId: data.submissionId,
            },
            defaults: data,
            transaction,
        });
    }

    // Retrieves active VSL runs that are not currently on hold.
    async findRunnableRuns(now: Date = new Date(),limit: number = 100,transaction?: Transaction): Promise<VslRun[]> {
        return await this.model.findAll({
            where: {
                status: VslRunStatus.ACTIVE,
                [Op.or]: [
                    { holdUntil: null },
                    { holdUntil: { [Op.lte]: now } },
                ],
            },
            order: [['createdAt', 'ASC']],
            limit,
            transaction,
        });
    }
}

export default VslRunRepository;
