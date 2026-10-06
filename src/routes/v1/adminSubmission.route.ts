import { Router } from 'express';

import adminSubmissionController from '../../controllers/adminSubmission.controller';
import { validateRequestParams, validateRequestQuery } from '../../validators';
import { adminSubmissionParamsSchema, adminSubmissionsQuerySchema } from '../../validators/adminSubmission.validator';

const adminSubmissionRouter = Router();

// GET /api/v1/admin/submissions
adminSubmissionRouter.get(
    '/',
    validateRequestQuery(adminSubmissionsQuerySchema),
    adminSubmissionController.getAdminSubmissionsHandler
);

// GET /api/v1/admin/submissions/:publicId
adminSubmissionRouter.get(
    '/:publicId',
    validateRequestParams(adminSubmissionParamsSchema),
    adminSubmissionController.getAdminSubmissionDetailHandler
);

export default adminSubmissionRouter;
