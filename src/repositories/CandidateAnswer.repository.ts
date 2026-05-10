import CandidateAnswer from '../db/models/CandidateAnswer.model';
import BaseRepository from './Base.repository';

class CandidateAnswerRepository extends BaseRepository<CandidateAnswer> {
    constructor() {
        super(CandidateAnswer);
    }
}

export default CandidateAnswerRepository;