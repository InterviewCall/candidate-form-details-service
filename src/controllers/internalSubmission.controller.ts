import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CandidateAnswerRepository from '../repositories/CandidateAnswer.repository';
import CandidateSubmissionRepository from '../repositories/CandidateSubmission.repository';
import SubmissionLookupService from '../services/SubmissionLookup.service';
import { SubmissionLookupResponse } from '../types/SubmissionLookup.type';
import { buildSuccessResponse } from '../utils/helpers/response.helper';
import { lookupSubmissionsBodySchema } from '../validators/submissionLookup.validator';

const submissionLookupService = new SubmissionLookupService(
    new CandidateSubmissionRepository(),
    new CandidateAnswerRepository()
);

async function lookupSubmissionsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { submissionIds, answerKeys } = lookupSubmissionsBodySchema.parse(req.body);
        const submissions = await submissionLookupService.lookupByPublicIds(submissionIds, answerKeys);
        res.status(StatusCodes.OK).json(
            buildSuccessResponse<SubmissionLookupResponse>('Submissions fetched successfully', { submissions })
        );
    } catch (error) {
        next(error);
    }
}

export default {
    lookupSubmissionsHandler,
};
