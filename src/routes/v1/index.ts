import express from 'express';

import candidateRouter from './candidate.route';
import submissionRouter from './candidateSubmission.route';
import formRouter from './form.route';
import pingRouter from './ping.route';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);

v1Router.use('/admin', formRouter);

v1Router.use('/forms', formRouter);

v1Router.use('/candidates', candidateRouter);

v1Router.use('/submissions', submissionRouter);

export default v1Router;