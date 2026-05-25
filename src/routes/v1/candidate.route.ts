import { Router } from 'express';

import candidateController from '../../controllers/candidate.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import { createCandidateSchema, getCandidateParamsSchema } from '../../validators/candidate.validator';

const candidateRouter = Router();

candidateRouter.post(
    '/',
    validateRequestBody(createCandidateSchema),
    candidateController.createCadidateHandler
);

candidateRouter.get(
    '/:candidateId',
    validateRequestParams(getCandidateParamsSchema),
    candidateController.getCandidateHandler
);

export default candidateRouter;