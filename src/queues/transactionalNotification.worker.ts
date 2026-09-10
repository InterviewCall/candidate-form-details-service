import { Job, Worker } from 'bullmq';

import { bullMqConnection } from '../configs/bullMq.config';
import logger from '../configs/logger.config';
import { getRedisClient } from '../configs/redis.config';
import { TRANSACTIONAL_NOTIFICATION_QUEUE } from '../constants';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import { BookingNotificationDto } from '../dtos/BookingNotification.dto';
import { sendBookingPendingNotification } from '../services/Notification.service';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';

async function processBookingNotification(job: Job<BookingNotificationDto>): Promise<void> {
    const submission = await CandidateSubmission.findOne({
        where: {
            publicId: job.data.submissionId
        },
        include: [
            {
                association: 'candidate',
                required: true
            }
        ]
    });

    // Check latest booking/confirmation status: if confirmed (not booking_pending) or candidate missing, do nothing
    if (!submission || submission.status !== CandidateSubmissionStatus.BOOKING_PENDING || !submission.candidate) {
        logger.info('Booking notification skipped - submission not found, already confirmed, or candidate missing', {
            submissionId: job.data.submissionId,
            status: submission?.status
        });
        return;
    }

    // Prevent duplicate emails: check Redis if reminder was already sent
    const redis = getRedisClient();
    const reminderSentKey = `reminder:sent:${submission.publicId}`;
    const alreadySent = await redis.get(reminderSentKey);
    if (alreadySent) {
        logger.info('Booking notification skipped - reminder email already sent previously', {
            submissionId: submission.publicId
        });
        return;
    }

    await sendBookingPendingNotification({
        ...job.data,
        candidateName: submission.candidate.fullName,
        candidateEmail: submission.candidate.email,
        candidatePhone: submission.candidate.phone,
        submissionId: submission.publicId
    });

    // Mark as sent in Redis with 30-day retention
    await redis.set(reminderSentKey, 'true', 'EX', 30 * 24 * 60 * 60);

    logger.info('Booking notification successfully sent and recorded', {
        submissionId: submission.publicId,
        candidateEmail: submission.candidate.email
    });
}

export const transactionalNotificationWorker = new Worker<BookingNotificationDto>(
    TRANSACTIONAL_NOTIFICATION_QUEUE,
    processBookingNotification,
    {
        connection: bullMqConnection,
        concurrency: 5
    }
);

transactionalNotificationWorker.on('error', (error) => {
    logger.error('Transactional notification worker error', { error });
});
