import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import FormStepRepository from '../repositories/FormStep.repository';
import AdminSubmissionService from '../services/AdminSubmission.service';
import { AdminSubmissionDetail, AdminSubmissionsListResponse } from '../types/AdminSubmission.type';
import { buildSuccessResponse } from '../utils/helpers/response.helper';
import { adminSubmissionParamsSchema, adminSubmissionsQuerySchema } from '../validators/adminSubmission.validator';

const adminSubmissionService = new AdminSubmissionService(
    new CandidateSubmissionRepository(),
    new CandidateAnswerRepository(),
    new FormStepRepository()
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

export default {
    getAdminSubmissionsHandler,
    getAdminSubmissionDetailHandler,
};
