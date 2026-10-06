// What the slot-booking-service returns from POST /internal/bookings/lookup (one row per submission that has a booking).
export type BookingLookupItem = {
    submissionId: string
    bookingId: string
    status: 'initiated' | 'confirmed' | 'cancelled' | 'completed'
    slotId: number
    slotStartAt: string
    createdAt: string
    confirmedAt: string | null
    cancelledAt: string | null
    completedAt: string | null
    cancelSource: string | null
}

// The booking service's answer to the lookup, wrapped in its usual response envelope.
export type BookingLookupEnvelope = {
    success: boolean
    data?: { bookings?: BookingLookupItem[] }
}
