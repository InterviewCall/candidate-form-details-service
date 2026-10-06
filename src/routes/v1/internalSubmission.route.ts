import { Router } from 'express';

import internalSubmissionController from '../../controllers/internalSubmission.controller';
import { validateInternalApiKey } from '../../middlewares/internalApiKey.middleware';
import { validateRequestBody } from '../../validators';
import { lookupSubmissionsBodySchema } from '../../validators/submissionLookup.validator';

const internalSubmissionRouter = Router();

// POST /api/v1/internal/submissions/lookup
internalSubmissionRouter.post(
    '/lookup',
    validateInternalApiKey,
    validateRequestBody(lookupSubmissionsBodySchema),
    internalSubmissionController.lookupSubmissionsHandler
);

export default internalSubmissionRouter;
