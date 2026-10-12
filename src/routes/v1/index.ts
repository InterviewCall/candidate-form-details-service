import express from 'express';

import adminSubmissionRouter from './adminSubmission.route';
import candidateRouter from './candidate.route';
import submissionRouter from './candidateSubmission.route';
import formRouter from './form.route';
import internalSubmissionRouter from './internalSubmission.route';
import pingRouter from './ping.route';
import workrIntegrationRouter from './workrIntegration.route';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);

// Service-to-service endpoints (the booking service reads candidates and answers here). Never exposed by the reverse proxy.
v1Router.use('/internal/submissions', internalSubmissionRouter);

// Endpoints WorkR calls from its own server. Deliberately not under /internal: the reverse proxy hides that prefix from the public
// domain, and WorkR can only reach this service through it. Protected by WorkR's own key instead.
v1Router.use('/integrations/workr', workrIntegrationRouter);

// Must come before the '/admin' form router, which has a catch-all GET /:slug that would swallow /admin/submissions
v1Router.use('/admin/submissions', adminSubmissionRouter);

v1Router.use('/admin', formRouter);

v1Router.use('/forms', formRouter);

v1Router.use('/candidates', candidateRouter);

v1Router.use('/submissions', submissionRouter);

export default v1Router;