// Why a candidate's VSL follow-up chain was stopped before the end.
export enum VslStopReason {
    // the candidate finished the qualification form
    FORM_SUBMITTED = 'form_submitted',

    // the candidate booked a slot
    BOOKED = 'booked',

    // the candidate was converted
    CONVERTED = 'converted',

    // the submission was cancelled
    SUBMISSION_CANCELLED = 'submission_cancelled',

    // the candidate asked us to stop all messages
    OPTED_OUT = 'opted_out',

    // the candidate unsubscribed from our mails
    UNSUBSCRIBED = 'unsubscribed',

    // These CRM-related reasons currently arrive through the manual stop endpoint.
    NOT_INTERESTED = 'not_interested',
    WON = 'won',
    ENROLLED = 'enrolled',
    LATER_STAGE = 'later_stage',

    OTHER = 'other'
}