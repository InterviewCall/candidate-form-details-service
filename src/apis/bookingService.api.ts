import { bookingServiceApi } from '../configs/axios.config';
import { internalApiConfig } from '../configs/server.config';
import { BOOKING_LOOKUP_MAX_IDS } from '../constants/lookup';
import { BookingLookupEnvelope, BookingLookupItem } from '../types/BookingLookup.type';

/**
 * Asks the booking service for the latest booking of each submission.
 * Throws when the service cannot be reached, answers with an error, or the key is not configured;
 * callers decide whether that is fatal (the admin pages treat it as "no booking data").
 */
export async function lookupBookingsBySubmissionIds(submissionIds: string[]): Promise<BookingLookupItem[]> {
    if (submissionIds.length === 0) {
        return [];
    }

    if (submissionIds.length > BOOKING_LOOKUP_MAX_IDS) {
        throw new Error(`Cannot look up more than ${BOOKING_LOOKUP_MAX_IDS} submissions at once`);
    }

    if (!internalApiConfig.INTERNAL_API_KEY) {
        throw new Error('SCHEDULER_INTERNAL_API_KEY is not configured');
    }

    // axios rejects on any non-2xx status and on timeouts, so a normal return means the service answered OK.
    const response = await bookingServiceApi.post<BookingLookupEnvelope>('/internal/bookings/lookup', { submissionIds });
    const bookings = response.data.data?.bookings;

    if (!response.data.success || !Array.isArray(bookings)) {
        throw new Error('Booking service lookup returned an unexpected response');
    }

    return bookings;
}
