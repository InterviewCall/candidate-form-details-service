import { NotificationChannel } from '../utils/enums/NotificationChannel.enum';

// Enable JSON serialization of BigInt values for BullMQ and logging
if (typeof (BigInt.prototype as any).toJSON !== 'function') {
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };
}

export type BookingNotificationDto = {
    bookingId: bigint | number | string;
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
};