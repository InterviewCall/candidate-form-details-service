import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { LeadTemperature } from '../utils/enums/LeadTemperature';

// 'completed' = the admin marked the counselling call as done.
export type AdminBookingStatus = 'confirmed' | 'initiated' | 'cancelled' | 'completed';

export type AdminSubmissionListItem = {
    publicId: string
    candidate: {
        fullName: string
        email: string
        phone: string
    }
    formSlug: string
    formName: string
    status: CandidateSubmissionStatus
    leadScore: number | null
    leadTemperature: LeadTemperature | null
    source: string | null
    utmCampaign: string | null
    reminderCount: number
    createdAt: string
    submittedAt: string | null
    // Filled from the booking service (I1). Null when the submission has no booking, or the booking service is down.
    booking: {
        slotStartAt: string
        status: AdminBookingStatus
    } | null
}

export type AdminSubmissionStatusCounts = Record<CandidateSubmissionStatus | 'all', number>;

export type AdminSubmissionsSummary = {
    total: number
    hot: number
    completedForms: number
    bookedOrConverted: number
    hotNotBooked: number
    statusCounts: AdminSubmissionStatusCounts
}

export type AdminSubmissionsListResponse = {
    items: AdminSubmissionListItem[]
    page: number
    pageSize: number
    totalItems: number
    summary: AdminSubmissionsSummary
    availableSources: string[]
    // Present only when part of the page could not be filled in, e.g. ["booking-service unavailable"].
    warnings?: string[]
}

export type AdminSubmissionAnswer = {
    questionKey: string
    questionText: string
    // What the candidate sees: the option LABEL for select/radio/checkbox, the typed text otherwise. Null when unanswered.
    answerText: string | null
    // Score of the selected option; null when the question is not part of lead scoring.
    optionScore: number | null
}

export type AdminSubmissionStep = {
    stepNo: number
    title: string
    answers: AdminSubmissionAnswer[]
}

export type AdminTimelineEvent = {
    key: string
    label: string
    at: string | null
    // Whether this step is finished. Decided here, not from the clock: the counselling call is done only once the admin marks it.
    done: boolean
}

export type AdminNotificationItem = {
    id: string
    notificationType: 'BOOKING_CONFIRMED' | 'BOOKING_REMINDER'
    reminderNumber: number
    channel: 'EMAIL' | 'WHATSAPP'
    sendStatus: 'SENT' | 'FAILED' | 'PROCESSING'
    failedReason: string | null
}

export type AdminSubmissionDetail = AdminSubmissionListItem & {
    candidateFirstSeenAt: string
    attribution: {
        source: string | null
        medium: string | null
        campaign: string | null
        content: string | null
        term: string | null
        landingPage: string | null
        referrerUrl: string | null
    }
    steps: AdminSubmissionStep[]
    scoredQuestionCount: number
    timeline: AdminTimelineEvent[]
    // Filled from the booking service (I1). Null when there is no booking, or the booking service is down.
    bookingDetails: {
        bookingId: string
        slotStartAt: string
        status: AdminBookingStatus
        completedAt: string | null
    } | null
    // Filled from the notification service (I3). Empty when nothing was sent, or the notification service is down.
    notifications: AdminNotificationItem[]
    // Present only when part of the page could not be filled in, e.g. ["booking-service unavailable"].
    warnings?: string[]
}
