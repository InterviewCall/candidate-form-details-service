import CandidateSubmission from '../db/models/CandidateSubmission.model';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import { NotFoundError } from '../utils/errors/app.error';

class CandidateSubmissionService {
    constructor(private readonly candidateSubmissionRepository: CandidateSubmissionRepository) {}

    async findAllCandidatesWhereBookingPending(): Promise<CandidateSubmission[]> {
        const cutoffTime = new Date(Date.now() - 1 * 60 * 1000);
        const submissions = await this.candidateSubmissionRepository.findAllBookingPendingSubmisssions(cutoffTime);
    
        return submissions;
    }
    async markSubmissionAsBooked(submissionId: string): Promise<void> {
        const submission = await this.candidateSubmissionRepository.findById(submissionId);

        if(!submission) {
            throw new NotFoundError(`No candidate submission found with id: ${submissionId}`);
        }

        await this.candidateSubmissionRepository.markSubmissionAsBooked(submissionId);
    }
    async updateReminderDetails(id: string,reminderCount: number,reminderTime: Date): Promise<boolean> {
        return await this.candidateSubmissionRepository.updateReminderDetails(
            id,
            reminderCount,
            reminderTime
        );
    }
}

export default CandidateSubmissionService;