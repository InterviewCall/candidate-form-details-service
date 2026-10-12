import { Router } from 'express';

import workrIntegrationController from '../../controllers/workrIntegration.controller';
import { validateWorkrIntegrationKey } from '../../middlewares/workrIntegrationKey.middleware';
import { validateRequestBody } from '../../validators';
import { workrEngagementBodySchema } from '../../validators/workrEngagement.validator';

const workrIntegrationRouter = Router();

// POST /api/v1/integrations/workr/engagement
workrIntegrationRouter.post(
    '/engagement',
    validateWorkrIntegrationKey,
    validateRequestBody(workrEngagementBodySchema),
    workrIntegrationController.lookupEngagementHandler
);

export default workrIntegrationRouter;
