import CandidateSubmission from '../db/models/CandidateSubmission.model';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';

class CandidateSubmissionService {
    constructor(private readonly candidateSubmissionRepository: CandidateSubmissionRepository) {}

    async findAllCandidatesWhereBookingPending(): Promise<CandidateSubmission[]> {
        const cutoffTime = new Date(Date.now() - 10 * 60 * 1000);
        const submissions = await this.candidateSubmissionRepository.findAllBookingPendingSubmisssions(cutoffTime);
    
        return submissions;
    }
}

export default CandidateSubmissionService;