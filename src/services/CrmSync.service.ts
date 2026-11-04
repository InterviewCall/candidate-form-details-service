import axios from 'axios';
import { Transaction } from 'sequelize';

import logger from '../configs/logger.config';
import { crmConfig } from '../configs/server.config';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import CrmOutboxRepository from '../repositories/CrmOutbox.repository';
import { resolveAnswerLabel } from '../utils/helpers/answerLabel.helper';

export const CRM_EVENT_DETAILS = 'vsl.details_submitted';
export const CRM_EVENT_FORM = 'vsl.form_submitted';

type CrmEventType = typeof CRM_EVENT_DETAILS | typeof CRM_EVENT_FORM;

interface CrmEnvelope {
    eventId: string;
    type: CrmEventType;
    occurredAt: string;
    payload: Record<string, unknown>;
}

// 30s, 2m, 10m, then every 30m for as long as the CRM stays unreachable. A step is never dropped for being slow to deliver.
const BACKOFF_MS = [30 * 1000, 2 * 60 * 1000, 10 * 60 * 1000, 30 * 60 * 1000];
const LEASE_MS = 2 * 60 * 1000;
const BATCH = 25;

export const eventIdFor = (type: CrmEventType, submissionPublicId: string): string =>
    `${type === CRM_EVENT_DETAILS ? 'vsl-details' : 'vsl-form'}-${submissionPublicId}`;

/**
 * Sends the funnel to the CRM: "gave details" when the person registers, "filled the form" when they submit it.
 * (The booking service sends "booked" and "call done".)
 *
 * The step is written to crm_outbox in the same transaction that saves it, and sent afterwards from there, so a CRM
 * outage never loses a lead and never slows or breaks the candidate's page. The message itself is built from the
 * database at send time, which keeps it complete and current.
 */
class CrmSyncService {
    private timer: NodeJS.Timeout | null = null;
    private running = false;
    private rerun = false;

    constructor(
        private readonly outbox: CrmOutboxRepository,
        private readonly submissions: CandidateSubmissionRepository,
        private readonly answers: CandidateAnswerRepository
    ) {}

    get enabled(): boolean {
        return crmConfig.ENABLED;
    }

    /** Call inside the transaction that saves the step. Never throws: a problem here must not break the funnel. */
    async enqueue(type: CrmEventType, submissionPublicId: string, transaction: Transaction): Promise<void> {
        if (!crmConfig.ENABLED) {
            return;
        }

        try {
            await this.outbox.enqueue(eventIdFor(type, submissionPublicId), type, submissionPublicId, transaction);
        } catch (error) {
            logger.error('Could not queue the CRM event', { type, submissionPublicId, error });
        }
    }

    /** Call after the transaction committed: sends what is waiting without making the caller wait. */
    kick(): void {
        if (!crmConfig.ENABLED) {
            return;
        }
        setImmediate(() => void this.flush());
    }

    start(): void {
        if (!crmConfig.ENABLED) {
            logger.info('CRM sync is off (CRM_SYNC_ENABLED is not true)');
            return;
        }
        if (!crmConfig.BASE_URL || !crmConfig.INTAKE_KEY) {
            logger.error('CRM sync is on but CRM_BASE_URL or CRM_INTAKE_KEY is missing: nothing will be delivered');
        }
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => void this.flush(), crmConfig.POLL_MS);
        this.timer.unref();
        this.kick();
        logger.info('CRM sync started', { baseUrl: crmConfig.BASE_URL });
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /** Sends every event that is due. One run at a time; a request that arrives meanwhile triggers one more pass. */
    async flush(): Promise<number> {
        if (!crmConfig.ENABLED || !crmConfig.BASE_URL || !crmConfig.INTAKE_KEY) {
            return 0;
        }
        if (this.running) {
            this.rerun = true;
            return 0;
        }

        this.running = true;
        let sent = 0;
        try {
            do {
                this.rerun = false;
                const due = await this.outbox.findDue(BATCH);
                for (const row of due) {
                    if (!(await this.outbox.claim(row.id, LEASE_MS))) {
                        continue;
                    }
                    if (await this.deliver(row.id, row.eventId, row.eventType as CrmEventType, row.submissionPublicId, row.attempts)) {
                        sent += 1;
                    }
                }
                if (due.length === BATCH) {
                    this.rerun = true;
                }
            } while (this.rerun);
        } catch (error) {
            logger.error('CRM sync pass failed', error);
        } finally {
            this.running = false;
        }
        return sent;
    }

    private async deliver(id: number, eventId: string, type: CrmEventType, submissionPublicId: string, attemptsSoFar: number): Promise<boolean> {
        const attempts = attemptsSoFar + 1;
        try {
            const envelope = await this.build(eventId, type, submissionPublicId);
            if (!envelope) {
                await this.outbox.markFailed(id, attempts, 'The submission no longer exists');
                return false;
            }

            await axios.post(`${crmConfig.BASE_URL}/intake/events`, envelope, {
                timeout: crmConfig.TIMEOUT_MS,
                headers: { 'Content-Type': 'application/json', 'x-intake-key': crmConfig.INTAKE_KEY }
            });
            await this.outbox.markSent(id);
            return true;
        } catch (error) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            const reason = this.describe(error);

            // 400: the CRM read the message and refused it. Sending it again cannot help, so it stops here for a person to look at.
            if (status === 400) {
                logger.error('The CRM refused an event', { eventId, reason });
                await this.outbox.markFailed(id, attempts, reason);
                return false;
            }

            // 401/403 (key wrong or revoked), 5xx, timeouts, network: try again later.
            const wait = BACKOFF_MS[Math.min(attempts - 1, BACKOFF_MS.length - 1)];
            logger.warn('CRM event not delivered, will retry', { eventId, attempts, reason });
            await this.outbox.markRetry(id, attempts, new Date(Date.now() + wait), reason);
            return false;
        }
    }

    private describe(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const body = error.response?.data as { message?: unknown; error?: unknown } | undefined;
            const detail = typeof body?.message === 'string' ? body.message : typeof body?.error === 'string' ? body.error : '';
            return `${error.response?.status ?? error.code ?? 'network'}${detail ? `: ${detail}` : ''}`;
        }
        return error instanceof Error ? error.message : String(error);
    }

    private async build(eventId: string, type: CrmEventType, submissionPublicId: string): Promise<CrmEnvelope | null> {
        const submission = await this.submissions.findById(submissionPublicId);
        if (!submission || !submission.candidate) {
            return null;
        }

        const details = this.details(submission);

        if (type === CRM_EVENT_DETAILS) {
            return { eventId, type, occurredAt: submission.createdAt.toISOString(), payload: details };
        }

        const submittedAt = submission.submittedAt ?? new Date();
        return {
            eventId,
            type,
            occurredAt: submittedAt.toISOString(),
            payload: {
                ...details,
                score: submission.leadScore,
                temperature: submission.leadTemperature,
                answers: await this.answersOf(submission),
                submittedAt: submittedAt.toISOString()
            }
        };
    }

    private details(submission: CandidateSubmission): Record<string, unknown> {
        const candidate = submission.candidate!;
        return {
            submissionId: submission.publicId,
            formSlug: submission.formSlug,
            fullName: candidate.fullName,
            email: candidate.email,
            phone: candidate.phone,
            source: submission.source,
            landingPage: submission.landingPage,
            utmSource: submission.utmSource,
            utmMedium: submission.utmMedium,
            utmCampaign: submission.utmCampaign,
            utmContent: submission.utmContent,
            utmTerm: submission.utmTerm
        };
    }

    /** The answers as a person reads them: question text, and the label of the option picked, in form order. */
    private async answersOf(submission: CandidateSubmission): Promise<Array<{ key: string; question: string; answer: string }>> {
        const rows = await this.answers.findAllForSubmission(submission.id);

        return rows
            .map((row) => {
                const question = row.question!;
                return {
                    stepNo: question.step?.stepNo ?? 0,
                    sortOrder: question.sortOrder,
                    key: question.questionKey,
                    question: question.questionText,
                    answer: resolveAnswerLabel(row, question.questionType, question.options ?? [])
                };
            })
            .filter((row): row is typeof row & { answer: string } => row.answer !== null && row.answer.trim() !== '')
            .sort((a, b) => a.stepNo - b.stepNo || a.sortOrder - b.sortOrder)
            .map(({ key, question, answer }) => ({ key, question, answer }));
    }
}

export default CrmSyncService;
