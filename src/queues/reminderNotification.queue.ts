import { Queue } from 'bullmq';

import { bullMqConnection } from '../configs/bullmq.config';
import { REMINDER_NOTIFICATION_QUEUE  } from '../constants';
import { BookingReminderNotificationDto } from '../dtos/BookingReminderNotification.dto';

const reminderNotificationQueue = new Queue<BookingReminderNotificationDto>(
    REMINDER_NOTIFICATION_QUEUE,
    {
        connection: bullMqConnection,

        defaultJobOptions: {
            attempts: 2,
            backoff: {
                type: 'exponential',
                delay: 5000
            },

            removeOnComplete: {
                age: 24 * 60 * 60,
                count: 1000
            },

            removeOnFail: {
                age: 7 * 24 * 60 * 60,
                count: 5000
            }
        }
    }
);

export default reminderNotificationQueue;