import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import FormStepRepository from '../repositories/FormStep.repository';
import AdminSubmissionService from '../services/AdminSubmission.service';
import { AdminSubmissionDetail, AdminSubmissionsListResponse } from '../types/AdminSubmission.type';
import { buildSuccessResponse } from '../utils/helpers/response.helper';
import { adminSubmissionParamsSchema, adminSubmissionsQuerySchema } from '../validators/adminSubmission.validator';
import VslManualCallService from '../services/VslManualCall.service';
import { VslManualCallState } from '../types/VslManualCall.type';
import VslRunRepository from '../repositories/VslRun.repository';
import VslStepRepository from '../repositories/VslStep.repository';

const adminSubmissionService = new AdminSubmissionService(
    new CandidateSubmissionRepository(),
    new CandidateAnswerRepository(),
    new FormStepRepository()
);
const vslManualCallService = new VslManualCallService(
    new CandidateSubmissionRepository(),
    new VslRunRepository(),
    new VslStepRepository(),
);

async function getAdminSubmissionsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        // The validator middleware checks the query but does not replace req.query, so parse again to get defaults and numbers.
        const query = adminSubmissionsQuerySchema.parse(req.query);
        const response = await adminSubmissionService.getSubmissions(query);
        res.status(StatusCodes.OK).json(
            buildSuccessResponse<AdminSubmissionsListResponse>('Submissions fetched successfully', response)
        );
    } catch (error) {
        next(error);
    }
}

async function getAdminSubmissionDetailHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { publicId } = adminSubmissionParamsSchema.parse(req.params);
        const response = await adminSubmissionService.getSubmissionDetail(publicId);
        res.status(StatusCodes.OK).json(
            buildSuccessResponse<AdminSubmissionDetail>('Submission fetched successfully', response)
        );
    } catch (error) {
        next(error);
    }
}
async function getVslManualCallStateHandler(req: Request,res: Response,next: NextFunction) {
    try {
        const { publicId } = adminSubmissionParamsSchema.parse(req.params);

        const response = await vslManualCallService.getCallState(publicId);

        res.status(StatusCodes.OK).json(
            buildSuccessResponse<VslManualCallState>(
                'VSL manual call state fetched successfully',
                response
            )
        );
    } catch (error) {
        next(error);
    }
}

async function markVslCallDoneHandler(req: Request,res: Response,next: NextFunction) {
    try {
        const { publicId } = adminSubmissionParamsSchema.parse(req.params);

        const response = await vslManualCallService.markCallDone(publicId);

        res.status(StatusCodes.OK).json(
            buildSuccessResponse<VslManualCallState>(
                'Call marked as done and VSL sequence stopped successfully',
                response
            )
        );
    } catch (error) {
        next(error);
    }
}
export default {
    getAdminSubmissionsHandler,
    getAdminSubmissionDetailHandler,
    getVslManualCallStateHandler,
    markVslCallDoneHandler
};
