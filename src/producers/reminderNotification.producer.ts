import logger from '../configs/logger.config';
import { REMINDER_NOTIFICATION_PAYLOAD } from '../constants';
import { BookingReminderNotificationDto } from '../dtos/BookingReminderNotification.dto';
import reminderNotificationQueue from '../queues/reminderNotification.queue';

export async function addBookingReminderDetailsToQueue(payload: BookingReminderNotificationDto) {
    await reminderNotificationQueue.add(
        REMINDER_NOTIFICATION_PAYLOAD,
        payload
    );

    logger.info(`Payload added to the queue: ${JSON.stringify(payload)}`);
}