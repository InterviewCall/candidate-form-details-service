import { AdminSubmissionAnswer } from './AdminSubmission.type';
import { BookingLookupItem } from './BookingLookup.type';
import { NotificationLookupItem } from './NotificationLookup.type';

// A step of the submission detail while it is being put together from the answers.
export type StepDraft = {
    stepNo: number
    title: string
    questions: Map<number, { sortOrder: number, answer: AdminSubmissionAnswer }>
};

// How the service asks the booking and notification services (swapped for fakes in tests).
export type BookingLookupFn = (submissionIds: string[]) => Promise<BookingLookupItem[]>;
export type NotificationLookupFn = (submissionIds: string[]) => Promise<NotificationLookupItem[]>;

// Bookings by the submission's public id, plus whether the booking service could be asked at all.
export type BookingLookupResult = {
    bySubmission: Map<string, BookingLookupItem>
    available: boolean
};
