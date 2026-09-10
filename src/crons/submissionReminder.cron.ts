import cron from 'node-cron';

import CandidateService from '../services/Candidate.service';
import CandidateRepository from '../repositories/Candidate.repository';
import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import FormQuestionOptionRepository from '../repositories/FormQuestionOption.repository';
import QualificationFormRepository from '../repositories/QualificationForm.repository';

const candidateService = new CandidateService(
    new CandidateRepository(),
    new CandidateSubmissionRepository(),
    new CandidateAnswerRepository(),
    new QualificationFormRepository(),
    new FormQuestionOptionRepository()
);

export function startSubmissionReminderCron() {
    cron.schedule('* * * * *', async () => {
        try {
            await candidateService.sendBookingPendingReminder();
        } catch (error) {
            console.error('Submission reminder cron failed', error);
        }
    });
}