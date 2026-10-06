import { notificationServiceApi } from '../configs/axios.config';
import { internalApiConfig } from '../configs/server.config';
import { NOTIFICATION_LOOKUP_MAX_IDS } from '../constants/lookup';
import { NotificationLookupEnvelope, NotificationLookupItem } from '../types/NotificationLookup.type';

/**
 * Asks the notification service for every delivery (email / WhatsApp) of the given submissions, oldest first.
 * Throws when the service cannot be reached or answers with an error; callers decide whether that is fatal.
 */
export async function lookupNotificationsBySubmissionIds(submissionIds: string[]): Promise<NotificationLookupItem[]> {
    if (submissionIds.length === 0) {
        return [];
    }

    if (submissionIds.length > NOTIFICATION_LOOKUP_MAX_IDS) {
        throw new Error(`Cannot look up more than ${NOTIFICATION_LOOKUP_MAX_IDS} submissions at once`);
    }

    if (!internalApiConfig.INTERNAL_API_KEY) {
        throw new Error('SCHEDULER_INTERNAL_API_KEY is not configured');
    }

    const response = await notificationServiceApi.post<NotificationLookupEnvelope>('/internal/notifications/lookup', { submissionIds });
    const deliveries = response.data.data?.deliveries;

    if (!response.data.success || !Array.isArray(deliveries)) {
        throw new Error('Notification service lookup returned an unexpected response');
    }

    return deliveries;
}
