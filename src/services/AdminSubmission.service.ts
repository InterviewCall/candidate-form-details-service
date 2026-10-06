import { lookupBookingsBySubmissionIds } from '../apis/bookingService.api';
import { lookupNotificationsBySubmissionIds } from '../apis/notificationService.api';
import logger from '../configs/logger.config';
import { BOOKING_SERVICE_UNAVAILABLE_WARNING, NOTIFICATION_SERVICE_UNAVAILABLE_WARNING } from '../constants/adminSubmission';
import CandidateAnswer from '../db/models/CandidateAnswer.model';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import { AdminSubmissionsQueryDto } from '../dtos/AdminSubmission.dto';
import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import FormStepRepository from '../repositories/FormStep.repository';
import {
    AdminBookingStatus,
    AdminNotificationItem,
    AdminSubmissionDetail,
    AdminSubmissionListItem,
    AdminSubmissionsListResponse,
    AdminSubmissionsSummary,
    AdminSubmissionStatusCounts,
    AdminSubmissionStep,
    AdminTimelineEvent,
} from '../types/AdminSubmission.type';
import { AdminSubmissionStatusCountRow } from '../types/AdminSubmissionFilter.type';
import { BookingLookupFn, BookingLookupResult, NotificationLookupFn, StepDraft } from '../types/AdminSubmissionService.type';
import { BookingLookupItem } from '../types/BookingLookup.type';
import { NotificationLookupItem } from '../types/NotificationLookup.type';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { NotFoundError } from '../utils/errors/app.error';
import { FORM_SCORING_QUESTION_KEYS } from '../utils/factories/scoringQuestionKeysFactory';
import { resolveAnswerLabel } from '../utils/helpers/answerLabel.helper';
import { getRangeStart } from '../utils/helpers/dateRange.helper';
import { describeLookupError } from '../utils/helpers/error.helper';

class AdminSubmissionService {
    constructor(
        private readonly candidateSubmissionRepository: CandidateSubmissionRepository,
        private readonly candidateAnswerRepository: CandidateAnswerRepository,
        private readonly formStepRepository: FormStepRepository,
        private readonly lookupBookings: BookingLookupFn = lookupBookingsBySubmissionIds,
        private readonly lookupNotifications: NotificationLookupFn = lookupNotificationsBySubmissionIds
    ) {}

    async getSubmissions(query: AdminSubmissionsQueryDto): Promise<AdminSubmissionsListResponse> {
        const baseFilters = {
            formSlug: query.formSlug,
            source: query.source,
            rangeStart: getRangeStart(query.range),
        };

        // The three reads do not depend on each other, so run them together.
        const [page, statusCountRows, availableSources] = await Promise.all([
            this.candidateSubmissionRepository.findAdminSubmissionPage({
                ...baseFilters,
                status: query.status,
                temperature: query.temperature,
                search: query.search,
                page: query.page,
                pageSize: query.pageSize,
            }),
            this.candidateSubmissionRepository.getAdminSubmissionStatusCounts(baseFilters),
            this.candidateSubmissionRepository.findDistinctSources(),
        ]);

        // Bookings live in another service; if it is down the page still loads, just without booking info.
        const bookings = await this.fetchBookings(page.rows.map((row) => row.publicId));

        return {
            items: page.rows.map((row) => this.toListItem(row, bookings.bySubmission.get(row.publicId))),
            page: query.page,
            pageSize: query.pageSize,
            totalItems: page.count,
            summary: this.buildSummary(statusCountRows),
            availableSources,
            ...this.warningsFor(bookings),
        };
    }

    async getSubmissionDetail(publicId: string): Promise<AdminSubmissionDetail> {
        const submission = await this.candidateSubmissionRepository.findAdminSubmissionDetail(publicId);

        if (!submission) {
            throw new NotFoundError('Submission not found');
        }

        // All three depend only on the submission, so run them together.
        const [answers, formSteps, bookings, notifications] = await Promise.all([
            this.candidateAnswerRepository.findAllForSubmission(submission.id),
            this.formStepRepository.findActiveStepsWithQuestions(submission.formId),
            this.fetchBookings([submission.publicId]),
            this.fetchNotifications(submission.publicId),
        ]);
        const booking = bookings.bySubmission.get(submission.publicId);

        const scoringKeys = new Set(FORM_SCORING_QUESTION_KEYS[submission.formSlug] ?? []);

        // Steps that have no saved answers at all (form never submitted) are shown as "no answers" by the panel.
        const steps = answers.length === 0 ? [] : this.buildSteps(answers, formSteps, scoringKeys);

        return {
            ...this.toListItem(submission, booking),
            candidateFirstSeenAt: submission.candidate!.createdAt.toISOString(),
            attribution: {
                source: submission.source,
                medium: submission.utmMedium,
                campaign: submission.utmCampaign,
                content: submission.utmContent,
                term: submission.utmTerm,
                landingPage: submission.landingPage,
                referrerUrl: submission.referrerUrl,
            },
            steps,
            scoredQuestionCount: scoringKeys.size,
            timeline: this.buildTimeline(submission, booking),
            bookingDetails: booking
                ? {
                    bookingId: booking.bookingId,
                    slotStartAt: booking.slotStartAt,
                    status: booking.status as AdminBookingStatus,
                    completedAt: booking.completedAt,
                }
                : null,
            notifications: notifications.items,
            ...this.warningsFor(bookings, notifications),
        };
    }

    /**
     * Never throws: a booking service outage must not take the submissions pages down.
     * The caller learns about the outage through `available` and reports it as a warning.
     */
    private async fetchBookings(submissionIds: string[]): Promise<BookingLookupResult> {
        const bySubmission = new Map<string, BookingLookupItem>();

        if (submissionIds.length === 0) {
            return { bySubmission, available: true };
        }

        try {
            const bookings = await this.lookupBookings(submissionIds);
            for (const booking of bookings) {
                bySubmission.set(booking.submissionId, booking);
            }
            return { bySubmission, available: true };
        } catch (error) {
            logger.error('Booking lookup for admin submissions failed', describeLookupError(error));
            return { bySubmission, available: false };
        }
    }

    /** Same rule as fetchBookings: an outage gives an empty list and `available: false`, never an error. */
    private async fetchNotifications(submissionId: string): Promise<{ items: AdminNotificationItem[], available: boolean }> {
        try {
            const deliveries = await this.lookupNotifications([submissionId]);
            return { items: deliveries.map((delivery) => this.toNotificationItem(delivery)), available: true };
        } catch (error) {
            logger.error('Notification lookup for admin submission failed', describeLookupError(error));
            return { items: [], available: false };
        }
    }

    private toNotificationItem(delivery: NotificationLookupItem): AdminNotificationItem {
        return {
            id: delivery.id,
            // The panel only knows "confirmation" and "reminder"; the reminder type is the not-booked nudge.
            notificationType: delivery.notificationType === 'BOOKING_CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_REMINDER',
            reminderNumber: delivery.reminderNumber,
            channel: delivery.channel,
            sendStatus: delivery.sendStatus,
            failedReason: delivery.failedReason,
        };
    }

    private warningsFor(bookings: BookingLookupResult, notifications?: { available: boolean }): { warnings?: string[] } {
        const warnings: string[] = [];

        if (!bookings.available) {
            warnings.push(BOOKING_SERVICE_UNAVAILABLE_WARNING);
        }

        if (notifications && !notifications.available) {
            warnings.push(NOTIFICATION_SERVICE_UNAVAILABLE_WARNING);
        }

        return warnings.length > 0 ? { warnings } : {};
    }

    private toListItem(submission: CandidateSubmission, booking?: BookingLookupItem): AdminSubmissionListItem {
        return {
            publicId: submission.publicId,
            candidate: {
                fullName: submission.candidate?.fullName ?? '',
                email: submission.candidate?.email ?? '',
                phone: submission.candidate?.phone ?? '',
            },
            formSlug: submission.formSlug,
            formName: submission.form?.name ?? '',
            status: submission.status,
            leadScore: submission.leadScore,
            leadTemperature: submission.leadTemperature,
            source: submission.source,
            utmCampaign: submission.utmCampaign,
            reminderCount: submission.reminderCount,
            createdAt: submission.createdAt.toISOString(),
            submittedAt: submission.submittedAt ? submission.submittedAt.toISOString() : null,
            booking: booking
                ? { slotStartAt: booking.slotStartAt, status: booking.status as AdminBookingStatus }
                : null,
        };
    }

    /**
     * Groups the answers by form step. Questions of the live form that were left unanswered are listed too (answerText null),
     * and answers to questions that have since been deactivated are kept, so nothing the candidate said disappears.
     */
    private buildSteps(answers: CandidateAnswer[], formSteps: Awaited<ReturnType<FormStepRepository['findActiveStepsWithQuestions']>>, scoringKeys: Set<string>): AdminSubmissionStep[] {
        const steps = new Map<number, StepDraft>();

        const getStep = (stepId: number, stepNo: number, title: string): StepDraft => {
            let step = steps.get(stepId);
            if (!step) {
                step = { stepNo, title, questions: new Map() };
                steps.set(stepId, step);
            }
            return step;
        };

        // 1. Every live question starts as unanswered.
        for (const formStep of formSteps) {
            const step = getStep(formStep.id, formStep.stepNo, formStep.title);

            for (const question of formStep.questions ?? []) {
                step.questions.set(question.id, {
                    sortOrder: question.sortOrder,
                    answer: { questionKey: question.questionKey, questionText: question.questionText, answerText: null, optionScore: null },
                });
            }
        }

        // 2. Fill in what the candidate answered.
        for (const answer of answers) {
            const question = answer.question!;
            const step = getStep(question.stepId, question.step!.stepNo, question.step!.title);
            const selectedOption = answer.selectedOption ?? null;

            step.questions.set(question.id, {
                sortOrder: question.sortOrder,
                answer: {
                    questionKey: question.questionKey,
                    questionText: question.questionText,
                    answerText: resolveAnswerLabel(answer, question.questionType, question.options ?? []),
                    optionScore: scoringKeys.has(question.questionKey) && selectedOption ? Number(selectedOption.score ?? 0) : null,
                },
            });
        }

        return Array.from(steps.values())
            .sort((a, b) => a.stepNo - b.stepNo)
            .map((step) => ({
                stepNo: step.stepNo,
                title: step.title,
                answers: Array.from(step.questions.values())
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((entry) => entry.answer),
            }))
            .filter((step) => step.answers.length > 0);
    }

    private buildTimeline(submission: CandidateSubmission, booking?: BookingLookupItem): AdminTimelineEvent[] {
        // A step that has a time has happened. Only the counselling call is different, see below.
        const step = (key: string, label: string, at: string | null): AdminTimelineEvent => ({ key, label, at, done: at !== null });

        const events: AdminTimelineEvent[] = [
            step('started', 'Form started', submission.createdAt.toISOString()),
            step('submitted', 'Form submitted', submission.submittedAt ? submission.submittedAt.toISOString() : null),
            step('reserved', 'Slot reserved', booking ? booking.createdAt : null),
            step('confirmed', 'Booking confirmed', booking ? booking.confirmedAt : null),
        ];

        // A cancelled booking replaces the call: it is not going to happen.
        if (booking?.status === 'cancelled') {
            events.push(step('cancelled', 'Booking cancelled', booking.cancelledAt));
        } else {
            // The call has a time once the booking is confirmed (an unconfirmed hold has none yet), but it is only
            // "done" after the admin marked it, not because the time has passed.
            const isBooked = booking?.status === 'confirmed' || booking?.status === 'completed';
            events.push({
                key: 'call',
                label: 'Counselling call',
                at: booking && isBooked ? booking.slotStartAt : null,
                done: booking?.status === 'completed',
            });
        }

        return events;
    }

    private buildSummary(rows: AdminSubmissionStatusCountRow[]): AdminSubmissionsSummary {
        const statusCounts: AdminSubmissionStatusCounts = {
            all: 0,
            [CandidateSubmissionStatus.SUBMISSION_PENDING]: 0,
            [CandidateSubmissionStatus.BOOKING_PENDING]: 0,
            [CandidateSubmissionStatus.BOOKED]: 0,
            [CandidateSubmissionStatus.CONVERTED]: 0,
            [CandidateSubmissionStatus.CANCELLED]: 0,
        };
        const hotByStatus: Partial<Record<CandidateSubmissionStatus, number>> = {};
        let hot = 0;

        // COUNT/SUM come back from MySQL as strings, hence Number().
        for (const row of rows) {
            const total = Number(row.total);
            const hotInRow = Number(row.hot ?? 0);

            statusCounts[row.status] = total;
            statusCounts.all += total;
            hotByStatus[row.status] = hotInRow;
            hot += hotInRow;
        }

        return {
            total: statusCounts.all,
            hot,
            completedForms: statusCounts.all - statusCounts[CandidateSubmissionStatus.SUBMISSION_PENDING],
            bookedOrConverted:
                statusCounts[CandidateSubmissionStatus.BOOKED] + statusCounts[CandidateSubmissionStatus.CONVERTED],
            hotNotBooked: hotByStatus[CandidateSubmissionStatus.BOOKING_PENDING] ?? 0,
            statusCounts,
        };
    }
}

export default AdminSubmissionService;
