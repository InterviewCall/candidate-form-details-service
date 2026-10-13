
import sequelize from '../db/models/sequelize';
import type VslRun from '../db/models/VslRun.model';

import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import VslRunRepository from '../repositories/VslRun.repository';
import VslStepRepository from '../repositories/VslStep.repository';

import type { VslManualCallState } from '../types/VslManualCall.type';

import { vslConfig } from '../configs/server.config';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { VslManualCallStatus } from '../utils/enums/VslManualCallStatus';
import { VslRunStatus } from '../utils/enums/VslRunStatus';
import { VslStopReason } from '../utils/enums/VslStopReason';

import {
    ConflictError,
    NotFoundError,
} from '../utils/errors/app.error';

class VslManualCallService {
    constructor(
        private readonly candidateSubmissionRepository: CandidateSubmissionRepository,
        private readonly vslRunRepository: VslRunRepository,
        private readonly vslStepRepository: VslStepRepository,
    ) {}

    /**
     * Calculates the Day 4 manual-call window.
     * The window remains open for one configured day unit.
     */
    private getCallWindow(anchorAt: Date): {
        startsAt: Date;
        endsAt: Date;
    } {
        const stepUnitMinutes = vslConfig.STEP_UNIT_MINUTES;

        if (
            !Number.isFinite(stepUnitMinutes) ||
            stepUnitMinutes <= 0
        ) {
            throw new Error(
                'VSL_STEP_UNIT_MINUTES must be a positive number.',
            );
        }

        const dayDurationMs = stepUnitMinutes * 60_000;

        const startsAt = new Date(
            anchorAt.getTime() + 4 * dayDurationMs,
        );

        const endsAt = new Date(
            startsAt.getTime() + dayDurationMs,
        );

        return {
            startsAt,
            endsAt,
        };
    }

    /**
     * Converts the database state into the status used by the Admin Panel.
     */
    private toCallState(
        run: VslRun | null,
        submissionStatus: CandidateSubmissionStatus,
        now: Date,
    ): VslManualCallState {
        if (!run) {
            return {
                status: VslManualCallStatus.NOT_ENROLLED,
                runStatus: null,
                callWindowStartsAt: null,
                callWindowEndsAt: null,
                callMarkedDoneAt: null,
                stopReason: null,
                canMarkCallDone: false,
            };
        }

        const { startsAt, endsAt } =
            this.getCallWindow(run.anchorAt);

        const commonState = {
            runStatus: run.status,
            callWindowStartsAt: startsAt.toISOString(),
            callWindowEndsAt: endsAt.toISOString(),
            callMarkedDoneAt:
                run.stopReason === VslStopReason.MANUAL_CALL_DONE &&
                run.stoppedAt
                    ? run.stoppedAt.toISOString()
                    : null,
            stopReason: run.stopReason,
        };

        // Preserve the manual-call completion state.
        if (
            run.status === VslRunStatus.STOPPED &&
            run.stopReason === VslStopReason.MANUAL_CALL_DONE
        ) {
            return {
                ...commonState,
                status: VslManualCallStatus.CALL_DONE,
                canMarkCallDone: false,
            };
        }

        // A completed run is different from a stopped run.
        if (run.status === VslRunStatus.COMPLETED) {
            return {
                ...commonState,
                status: VslManualCallStatus.COMPLETED,
                canMarkCallDone: false,
            };
        }

        // A run stopped for another reason cannot be actioned.
        if (run.status !== VslRunStatus.ACTIVE) {
            return {
                ...commonState,
                status: VslManualCallStatus.STOPPED,
                canMarkCallDone: false,
            };
        }

        // Only incomplete submissions are eligible.
        if (
            submissionStatus !==
            CandidateSubmissionStatus.SUBMISSION_PENDING
        ) {
            return {
                ...commonState,
                status: VslManualCallStatus.INELIGIBLE,
                canMarkCallDone: false,
            };
        }

        if (now < startsAt) {
            return {
                ...commonState,
                status: VslManualCallStatus.UPCOMING,
                canMarkCallDone: false,
            };
        }

        if (now >= endsAt) {
            return {
                ...commonState,
                status: VslManualCallStatus.EXPIRED,
                canMarkCallDone: false,
            };
        }

        return {
            ...commonState,
            status: VslManualCallStatus.OPEN,
            canMarkCallDone: true,
        };
    }

    /**
     * Fetches the manual-call state without modifying the database.
     */
    async getCallState(
        publicId: string,
        now: Date = new Date(),
    ): Promise<VslManualCallState> {
        const submission =
            await this.candidateSubmissionRepository.findManualCallSubmission(
                publicId,
            );

        if (!submission) {
            throw new NotFoundError('Submission not found.');
        }

        const run =
            await this.vslRunRepository.findBySubmissionId(
                submission.id,
            );

        return this.toCallState(
            run,
            submission.status,
            now,
        );
    }

    /**
     * Marks the manual call as done and stops the remaining VSL steps.
     * All database changes happen in one transaction.
     */
    async markCallDone(
        publicId: string,
        now: Date = new Date(),
    ): Promise<VslManualCallState> {
        return sequelize.transaction(async (transaction) => {
            // Fetch and lock the submission through its repository.
            const submission =
                await this.candidateSubmissionRepository.findManualCallSubmission(
                    publicId,
                    transaction,
                    true,
                );

            if (!submission) {
                throw new NotFoundError('Submission not found.');
            }

            // Fetch and lock the run through its repository.
            const run =
                await this.vslRunRepository.findBySubmissionId(
                    submission.id,
                    transaction,
                    true,
                );

            if (!run) {
                throw new ConflictError(
                    'No VSL sequence exists for this submission.',
                );
            }

            // A retry after a successful action must remain safe.
            if (
                run.status === VslRunStatus.STOPPED &&
                run.stopReason === VslStopReason.MANUAL_CALL_DONE
            ) {
                return this.toCallState(
                    run,
                    submission.status,
                    now,
                );
            }

            if (run.status !== VslRunStatus.ACTIVE) {
                throw new ConflictError(
                    'The VSL sequence is no longer active.',
                );
            }

            // Validate eligibility and the call window using server time.
            const currentState = this.toCallState(
                run,
                submission.status,
                now,
            );

            if (!currentState.canMarkCallDone) {
                let message: string;

                switch (currentState.status) {
                    case VslManualCallStatus.UPCOMING:
                        message =
                            'The manual call window has not started yet.';
                        break;

                    case VslManualCallStatus.EXPIRED:
                        message =
                            'The 24-hour manual call window has expired.';
                        break;

                    case VslManualCallStatus.INELIGIBLE:
                        message =
                            'The submission is no longer eligible for this action.';
                        break;

                    default:
                        message =
                            'The manual call cannot be marked as done.';
                        break;
                }

                throw new ConflictError(message);
            }

            // Update the run. The repository persists it in this transaction.
            run.status = VslRunStatus.STOPPED;
            run.stopReason = VslStopReason.MANUAL_CALL_DONE;
            run.stoppedAt = now;
            run.activeCandidateId = null;

            await this.vslRunRepository.saveManualCallRun(
                run,
                transaction,
            );

            // Cancel pending or processing steps, including the scheduled Day 7 email.
            await this.vslStepRepository.cancelPendingOrProcessingForRun(
                run.id,
                now,
                transaction,
            );

            return this.toCallState(
                run,
                submission.status,
                now,
            );
        });
    }
}

export default VslManualCallService;
