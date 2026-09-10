
import cron, { ScheduledTask } from 'node-cron';

import logger from '../configs/logger.config';
import { getRedisClient } from '../configs/redis.config';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import { BookingNotificationDto } from '../dtos/BookingNotification.dto';
import { NotificationChannel } from '../utils/enums/NotificationChannel.enum';
import transactionalNotificationQueue from './transactionalNotification.queue';

const candidateSubmissionRepository =
    new CandidateSubmissionRepository();

export function startBookingReminderScheduler(): ScheduledTask {
    const redis = getRedisClient();

    return cron.schedule('* * * * *', async () => {
        try {
            const submissions =
                await candidateSubmissionRepository.findBookingPendingSubmissions(1);

            if (!submissions.length) {
                logger.info('No pending booking reminders found');
                return;
            }

            let enqueuedCount = 0;

            await Promise.all(
                submissions.map(async (submission) => {
                    if (!submission.candidate) {
                        return;
                    }

                    const reminderSentKey = `reminder:sent:${submission.publicId}`;
                    const alreadySent = await redis.get(reminderSentKey);
                    if (alreadySent) {
                        return;
                    }

                    const jobId =
                        `booking-pending-reminder_${submission.publicId}`;

                    // Prevent duplicate reminder jobs
                    const existingJob =
                        await transactionalNotificationQueue.getJob(jobId);

                    if (existingJob) {
                        return;
                    }

                    const payload: BookingNotificationDto = {
                        bookingId: Number(submission.id),
                        candidateId: submission.candidateId,
                        submissionId: submission.publicId,
                        candidateName: submission.candidate.fullName,
                        candidateEmail: submission.candidate.email,
                        candidatePhone: submission.candidate.phone,
                        slotDate: '',
                        slotTime: '',
                        subject:
                            'Your InterviewCall booking is still pending',
                        channels: [NotificationChannel.EMAIL],
                        templateKeys: {
                            [NotificationChannel.EMAIL]: 'BookingPending',
                        },
                    };

                    await transactionalNotificationQueue.add(
                        'booking-pending-reminder',
                        payload,
                        {
                            jobId,
                        }
                    );

                    enqueuedCount++;
                })
            );

            logger.info('Booking reminder jobs enqueued', {
                found: submissions.length,
                enqueued: enqueuedCount,
            });
        } catch (error) {
            logger.error(
                'Failed to enqueue booking reminder jobs',
                {
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                }
            );
        }
    });
}
