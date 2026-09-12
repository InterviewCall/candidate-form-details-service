import cron from 'node-cron';
import { getBookingLink } from '../utils/helpers/getBookingLink';
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
                

                await candidateSubmissionService.updateReminderDetails(
                    submission.publicId
                );
                    

                await addBookingReminderDetailsToQueue({
                    submissionId: submission.publicId,
                    reminderNumber: submission.reminderCount + 1,
                    candidateId: submission.candidateId,
                    candidateName: submission.candidate.fullName,
                    candidateEmail: submission.candidate.email,
                    candidatePhone: submission.candidate.phone,
                    subject: 'Your InterviewCall booking is still pending',
                    channels: [NotificationChannel.EMAIL],
                    bookingLink: getBookingLink( submission.formSlug, submission.publicId ),

                    templateKeys: {
                        EMAIL: 'BookingReminder',
                        WHATSAPP: 'BookingReminder'
                    }
                });
            }
        }
    });
}