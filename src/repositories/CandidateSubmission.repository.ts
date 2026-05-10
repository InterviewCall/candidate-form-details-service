import CandidateSubmission from '../db/models/CandidateSubmission.model';
import BaseRepository from './Base.repository';

class CandidateSubmissionRepository extends BaseRepository<CandidateSubmission> {
    constructor() {
        super(CandidateSubmission);
    }
}

export default CandidateSubmissionRepository;