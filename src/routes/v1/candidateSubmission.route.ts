import { Router } from 'express';

import candidateController from '../../controllers/candidate.controller';
import { validateRequestParams } from '../../validators';
import { createCandidateSubmissionParamsSchema } from '../../validators/candidate.validator';

const submissionRouter = Router();

submissionRouter.post(
    '/:submissionId',
    validateRequestParams(createCandidateSubmissionParamsSchema),
    candidateController.createCandidateSubmissionHandler
);

export default submissionRouter;