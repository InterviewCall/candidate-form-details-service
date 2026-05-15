import { Router } from 'express';

import candidateController from '../../controllers/candidate.controller';
import { validateRequestBody } from '../../validators';
import { createCandidateSchema } from '../../validators/candidate.validator';

const candidateRouter = Router();

candidateRouter.post(
    '/',
    validateRequestBody(createCandidateSchema),
    candidateController.createCadidateHandler
);

export default candidateRouter;