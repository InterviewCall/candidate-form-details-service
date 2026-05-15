import { CreationAttributes, Transaction } from 'sequelize';

import Candidate from '../db/models/Candidate.model';
import BaseRepository from './Base.repository';

class CandidateRepository extends BaseRepository<Candidate> {
    constructor() {
        super(Candidate);
    }

    async create(data: CreationAttributes<Candidate>, transaction?: Transaction): Promise<Candidate> {
        return await this.model.create(data, { transaction });
    }
}

export default CandidateRepository;