import cron from 'node-cron';

import sequelize from '../db/models/sequelize';
import { addBookingReminderDetailsToQueue } from '../producers/reminderNotification.producer';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import CandidateSubmissionService from '../services/CandidateSubmission.service';
import { NotificationChannel } from '../utils/enums/NotificationChannel.enum';

const candidateSubmissionService = new CandidateSubmissionService(
    new CandidateSubmissionRepository()
);

export function bookingReminderCron(): void {
    cron.schedule('* * * * * ', async () => {
        const pendingBookings = await candidateSubmissionService.findAllCandidatesWhereBookingPending();

        if(pendingBookings.length > 0) {
            for(const submission of pendingBookings) {
                if(!submission.candidate) {
                    continue;
                }
                const candidate = submission.candidate;

                await sequelize.transaction(async (transaction) => {
                    const reminderUpdated = await candidateSubmissionService.updateReminderDetails(
                        submission.publicId,
                        transaction
                    );

                    if(!reminderUpdated) {
                        return;
                    }

                    await addBookingReminderDetailsToQueue({
                        submissionId: submission.publicId,
                        reminderNumber: submission.reminderCount + 1,
                        candidateId: submission.candidateId,
                        candidateName: candidate.fullName,
                        candidateEmail: candidate.email,
                        candidatePhone: candidate.phone,
                        subject: 'Your InterviewCall booking is still pending',
                        channels: [NotificationChannel.EMAIL],
                        bookingLink: `http://localhost:3001/readiness/${submission.formSlug}/book-strategy-call?submission-id=${submission.publicId}`,
                        templateKeys: {
                            EMAIL: 'BookingReminder',
                            WHATSAPP: 'BookingReminder'
                        }
                    });
                });
            }
        }
    });
}