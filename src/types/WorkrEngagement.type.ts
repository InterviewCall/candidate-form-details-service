import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';

export type WorkrEngagementContact = {
    ref: string
    email: string
    phone?: string
}

export type WorkrEngagementMatch = 'email' | 'phone';

// What WorkR is told about one of its users. registered=true means they already came to the VSL, so WorkR stops nudging them.
export type WorkrEngagementItem = {
    ref: string
    registered: boolean
    matchedBy: WorkrEngagementMatch | null
    // How far the most advanced of their submissions got. Null when not registered.
    stage: CandidateSubmissionStatus | null
    // When they first registered here (ISO). Null when not registered.
    registeredAt: string | null
}

export type WorkrEngagementResponse = {
    results: WorkrEngagementItem[]
}
