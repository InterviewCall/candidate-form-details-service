import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CandidateRepository from '../repositories/Candidate.repository';
import CandidateEngagementService from '../services/CandidateEngagement.service';
import { WorkrEngagementResponse } from '../types/WorkrEngagement.type';
import { buildSuccessResponse } from '../utils/helpers/response.helper';
import { workrEngagementBodySchema } from '../validators/workrEngagement.validator';

const candidateEngagementService = new CandidateEngagementService(new CandidateRepository());

async function lookupEngagementHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { contacts } = workrEngagementBodySchema.parse(req.body);
        const results = await candidateEngagementService.lookupForWorkr(contacts);
        res.status(StatusCodes.OK).json(
            buildSuccessResponse<WorkrEngagementResponse>('Engagement fetched successfully', { results })
        );
    } catch (error) {
        next(error);
    }
}

export default {
    lookupEngagementHandler,
};
