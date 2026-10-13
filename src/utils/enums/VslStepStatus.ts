// Where one step of the chain, for example the Day 1 email, stands.
export enum VslStepStatus {
    // Planned; its time has not come yet or it is waiting to be picked up.
    PENDING = 'pending',

    // Picked up by the sweeper and being handled right now.
    PROCESSING = 'processing',

    // Handed over to the notification queue.
    SENT = 'sent',

    // Deliberately not sent; the reason is saved.
    // For example: too late or unsubscribed.
    SKIPPED = 'skipped',

    // The chain stopped before this step was due.
    CANCELLED = 'cancelled',

    // Could not be handed over even after retries.
    FAILED = 'failed'
}