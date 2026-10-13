import { NotificationChannel } from '../utils/enums/NotificationChannel';
import { VslStepKey } from '../utils/enums/VslStepKey';

// Defines the payload sent through the VSL notification queue.
export type VslNotificationDto = {
    candidateId: number;
    submissionId: string;

    // Identifies the VSL run and the scheduled email step.
    vslRunId: number;
    vslStepId: number;
    stepKey: VslStepKey;

    // Candidate details required to deliver the email.
    candidateName: string;
    candidateEmail: string;

    // Link and subject used by the email template.
    formLink: string;
    subject: string;

    // The selected delivery channel and its template key.
    // The VSL implementation currently sends email only.
    channels: NotificationChannel[];
    templateKeys: Partial<Record<NotificationChannel, string>>;
};
