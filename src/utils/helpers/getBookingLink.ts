export function getBookingLink(formSlug: string, submissionId: string): string {
    const baseUrl = process.env.CANDIDATE_FRONTEND_URL;

    if (!baseUrl) {
        throw new Error('CANDIDATE_FRONTEND_URL is not configured');
    }

    return `${baseUrl}/readiness/${formSlug}/book-strategy-call?submission-id=${submissionId}`;
}