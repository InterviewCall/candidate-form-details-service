import logger from '../configs/logger.config';
import { TRANSACTIONAL_NOTIFICATION_PAYLOAD } from '../constants';
import { BookingNotificationDto } from '../dtos/BookingNotification.dto';
import transactionalNotificationQueue from '../queues/transactionalNotification.queue';

export async function addReminderDetailsToQueue(
    payload: BookingNotificationDto
) {
    await transactionalNotificationQueue.add(
        TRANSACTIONAL_NOTIFICATION_PAYLOAD,
        payload
    );

    logger.info(
        `Reminder payload added to the queue: ${JSON.stringify(payload)}`
    );
}