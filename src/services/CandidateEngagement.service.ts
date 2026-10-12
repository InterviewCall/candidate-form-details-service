import Candidate from '../db/models/Candidate.model';
import CandidateRepository from '../repositories/Candidate.repository';
import { WorkrEngagementContact, WorkrEngagementItem, WorkrEngagementMatch } from '../types/WorkrEngagement.type';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { indianPhoneVariants, lastTenDigits } from '../utils/helpers/phone.helper';

// How far along the funnel a submission is. Only used to report the furthest one; any of them counts as "registered".
const STAGE_RANK: Record<CandidateSubmissionStatus, number> = {
    [CandidateSubmissionStatus.SUBMISSION_PENDING]: 1,
    [CandidateSubmissionStatus.BOOKING_PENDING]: 2,
    [CandidateSubmissionStatus.CANCELLED]: 3,
    [CandidateSubmissionStatus.BOOKED]: 4,
    [CandidateSubmissionStatus.CONVERTED]: 5,
};

class CandidateEngagementService {
    constructor(private readonly candidateRepository: CandidateRepository) {}

    /**
     * For each WorkR contact: has this person already registered on the VSL (given us their details)?
     * One answer per contact, in the order given. Matches by email first (stored lowercase), then by the last 10 digits of the phone,
     * because the two systems write phone numbers differently. A candidate who registered at any point counts, whatever happened after.
     */
    async lookupForWorkr(contacts: WorkrEngagementContact[]): Promise<WorkrEngagementItem[]> {
        const prepared = contacts.map((contact) => ({
            contact,
            email: contact.email.trim().toLowerCase(),
            phone: lastTenDigits(contact.phone),
        }));

        const emails = [...new Set(prepared.map((item) => item.email))];
        const phones = [...new Set(prepared.flatMap((item) => (item.phone ? indianPhoneVariants(item.phone) : [])))];

        const candidates = await this.candidateRepository.findByEmailsOrPhones(emails, phones);

        const byEmail = new Map<string, Candidate[]>();
        const byPhone = new Map<string, Candidate[]>();
        for (const candidate of candidates) {
            addTo(byEmail, candidate.email.trim().toLowerCase(), candidate);

            const phone = lastTenDigits(candidate.phone);
            if (phone) {
                addTo(byPhone, phone, candidate);
            }
        }

        return prepared.map(({ contact, email, phone }) => {
            const emailMatches = byEmail.get(email) ?? [];
            const phoneMatches = phone ? (byPhone.get(phone) ?? []) : [];
            const matches = [...new Set([...emailMatches, ...phoneMatches])];

            if (matches.length === 0) {
                return { ref: contact.ref, registered: false, matchedBy: null, stage: null, registeredAt: null };
            }

            const matchedBy: WorkrEngagementMatch = emailMatches.length > 0 ? 'email' : 'phone';
            return {
                ref: contact.ref,
                registered: true,
                matchedBy,
                stage: furthestStage(matches),
                registeredAt: earliestRegistration(matches),
            };
        });
    }
}

function addTo(map: Map<string, Candidate[]>, key: string, candidate: Candidate): void {
    const list = map.get(key);
    if (list) {
        list.push(candidate);
    } else {
        map.set(key, [candidate]);
    }
}

function furthestStage(candidates: Candidate[]): CandidateSubmissionStatus | null {
    let best: CandidateSubmissionStatus | null = null;
    for (const candidate of candidates) {
        for (const submission of candidate.submissions ?? []) {
            const status: CandidateSubmissionStatus = submission.status;
            if (best === null || STAGE_RANK[status] > STAGE_RANK[best]) {
                best = status;
            }
        }
    }
    return best;
}

function earliestRegistration(candidates: Candidate[]): string | null {
    const times = candidates.map((candidate) => new Date(candidate.createdAt).getTime()).filter((time) => !Number.isNaN(time));
    return times.length > 0 ? new Date(Math.min(...times)).toISOString() : null;
}

export default CandidateEngagementService;
