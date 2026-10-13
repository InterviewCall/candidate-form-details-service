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

// GET /api/v1/admin/submissions/:publicId/vsl/manual-call
adminSubmissionRouter.get(
    '/:publicId/vsl/manual-call',
    validateRequestParams(adminSubmissionParamsSchema),
    adminSubmissionController.getVslManualCallStateHandler
);

// POST /api/v1/admin/submissions/:publicId/vsl/mark-call-done
adminSubmissionRouter.post(
    '/:publicId/vsl/mark-call-done',
    validateRequestParams(adminSubmissionParamsSchema),
    adminSubmissionController.markVslCallDoneHandler
);

export default adminSubmissionRouter;
