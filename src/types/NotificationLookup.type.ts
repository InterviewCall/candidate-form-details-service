// What the notification-service returns from POST /internal/notifications/lookup (one row per delivery of a submission).
export type NotificationLookupItem = {
    id: string
    submissionId: string
    bookingId: string | null
    // Raw type: BOOKING_CONFIRMED or FORM_SUBMITTED_SLOT_NOT_BOOKED_CHECK (a booking reminder).
    notificationType: 'BOOKING_CONFIRMED' | 'FORM_SUBMITTED_SLOT_NOT_BOOKED_CHECK'
    reminderNumber: number
    channel: 'EMAIL' | 'WHATSAPP'
    sendStatus: 'PROCESSING' | 'SENT' | 'FAILED'
    failedReason: string | null
}

// The notification service's answer to the lookup, wrapped in its usual response envelope.
export type NotificationLookupEnvelope = {
    success: boolean
    data?: { deliveries?: NotificationLookupItem[] }
}
