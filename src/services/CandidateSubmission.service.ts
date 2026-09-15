import logger from '../configs/logger.config';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import sequelize from '../db/models/sequelize';
import { addBookingReminderDetailsToQueue } from '../producers/reminderNotification.producer';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import { NotificationChannel } from '../utils/enums/NotificationChannel.enum';


class CandidateSubmissionService {
    constructor(private readonly candidateSubmissionRepository: CandidateSubmissionRepository) {}

    async findAllCandidatesWhereBookingPending(): Promise<CandidateSubmission[]> {
        const cutoffTime = new Date(Date.now() - 10 * 60 * 1000);
        const submissions = await this.candidateSubmissionRepository.findAllBookingPendingSubmisssions(cutoffTime);
    
        return submissions;
    }

    async sendReminderNotificationForPendingBookings() {
        const cutoffTime = new Date(Date.now() - 1 * 60 * 1000);
        const pendingBookingSubmissions: CandidateSubmission[] = await this.candidateSubmissionRepository.findAllBookingPendingSubmisssions(cutoffTime);

        if(pendingBookingSubmissions.length > 0) {
            for(const submission of pendingBookingSubmissions) {
                if(!submission.candidate) {
                    continue;
                }

                const transaction = await sequelize.transaction();
                try {
                    await this.candidateSubmissionRepository.increaseReminderCount(submission.publicId, transaction);

                    await addBookingReminderDetailsToQueue({
                        submissionId: submission.publicId,
                        candidateId: submission.candidateId,
                        candidateName: submission.candidate.fullName,
                        candidateEmail: submission.candidate.email,
                        candidatePhone: submission.candidate.phone,
                        subject: 'Your InterviewCall booking is still pending',
                        channels: [NotificationChannel.EMAIL],

                        bookingLink: `http://localhost:3001/${submission.formSlug}/book-strategy-call?submission-id=${submission.publicId}`,

                        templateKeys: {
                            EMAIL: 'BookingReminder',
                            WHATSAPP: 'BookingReminder'
                        }
                    });

                    await transaction.commit();
                } catch (error) {
                    await transaction.rollback();

                    logger.error(error);
                }
            }
        }
    }
}

export default CandidateSubmissionService;