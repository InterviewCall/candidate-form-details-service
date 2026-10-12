import { CreationAttributes, Op, Transaction } from 'sequelize';

import Candidate from '../db/models/Candidate.model';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import BaseRepository from './Base.repository';

class CandidateRepository extends BaseRepository<Candidate> {
    constructor() {
        super(Candidate);
    }

    async create(data: CreationAttributes<Candidate>, transaction?: Transaction): Promise<Candidate> {
        return await this.model.create(data, { transaction });
    }

    /**
     * Every candidate whose email is in `emails` or whose stored phone is exactly one of `phones`, with the status of each of
     * their submissions. Soft-deleted candidates are kept on purpose: they did come to the VSL, and the caller uses this to decide
     * whether to stop messaging someone, so a false "not registered" is the costly mistake.
     */
    async findByEmailsOrPhones(emails: string[], phones: string[]): Promise<Candidate[]> {
        const conditions = [];
        if (emails.length > 0) {
            conditions.push({ email: { [Op.in]: emails } });
        }
        if (phones.length > 0) {
            conditions.push({ phone: { [Op.in]: phones } });
        }
        if (conditions.length === 0) {
            return [];
        }

        return await this.model.findAll({
            where: { [Op.or]: conditions },
            include: [{ model: CandidateSubmission, as: 'submissions', attributes: ['status'], required: false }],
        });
    }
}

export default CandidateRepository;
