import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { LeadTemperature } from '../utils/enums/LeadTemperature';

// One submission as the booking service needs it to show a booking: who, how hot, and a few answers by question key.
export type SubmissionLookupItem = {
    submissionId: string
    status: CandidateSubmissionStatus
    formSlug: string
    formName: string
    leadScore: number | null
    leadTemperature: LeadTemperature | null
    candidate: {
        fullName: string
        email: string
        phone: string
    }
    // Display text of each requested answer (the option label for choice questions). A key the candidate did not answer is absent.
    answers: Record<string, string>
}

export type SubmissionLookupResponse = {
    submissions: SubmissionLookupItem[]
}
