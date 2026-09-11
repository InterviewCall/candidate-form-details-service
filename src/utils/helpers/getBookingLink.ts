export function getBookingLink(formSlug: string, submissionId: string): string {
    const baseUrl = process.env.BOOKING_FRONTEND_URL;

    if (!baseUrl) {
        throw new Error('BOOKING_FRONTEND_URL is not configured');
    }

    return `${baseUrl}/readiness/${formSlug}/book-strategy-call?submission-id=${submissionId}`;
}