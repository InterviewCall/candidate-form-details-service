import { NotificationChannel } from '../utils/enums/NotificationChannel.enum';

export type BookingNotificationDto = {
    bookingId: bigint | null;
    candidateId: number;
    submissionId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    slotDate: string;
    slotTime: string;
    subject: string;
    channels: NotificationChannel[];
    templateKeys: Record<NotificationChannel, string>;
    notificationType?: 'BOOKING_CONFIRMED' | 'FORM_SUBMITTED_SLOT_NOT_BOOKED_CHECK';
};