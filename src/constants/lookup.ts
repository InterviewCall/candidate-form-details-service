// How many submission ids one internal lookup call may carry. Both sides of a call must agree on the number.

// What this service accepts from the booking service (POST /internal/submissions/lookup).
export const MAX_LOOKUP_SUBMISSION_IDS = 100;
export const MAX_LOOKUP_ANSWER_KEYS = 20;

// What this service sends: the booking service accepts at most this many ids per call (see its lookup validator).
export const BOOKING_LOOKUP_MAX_IDS = 100;

// The notification service accepts at most this many ids per call (see its lookup validator).
export const NOTIFICATION_LOOKUP_MAX_IDS = 100;
