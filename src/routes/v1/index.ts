import express from 'express';

import formRouter from './form.route';
import pingRouter from './ping.route';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);

v1Router.use('/admin', formRouter);

v1Router.use('/forms', formRouter);

export default v1Router;