import Candidate from '../db/models/Candidate.model';
import BaseRepository from './Base.repository';

class CandidateRepository extends BaseRepository<Candidate> {
    constructor() {
        super(Candidate);
    }
}

export default CandidateRepository;