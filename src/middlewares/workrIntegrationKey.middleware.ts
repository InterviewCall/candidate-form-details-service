import { NextFunction, Request, Response } from 'express';

import { workrIntegrationConfig } from '../configs/server.config';
import { InternalServerError, UnauthorizedError } from '../utils/errors/app.error';
import { safeCompareSecrets } from '../utils/helpers/safeCompareSecrets.helper';

// Guards the endpoints WorkR calls: the caller must send WorkR's own shared secret in the configured header.
// Not configured means closed (500), never open, so WorkR treats it as "cannot tell" and sends nothing.
export function validateWorkrIntegrationKey(req: Request, _res: Response, next: NextFunction) {
    try {
        const { API_KEY, API_KEY_HEADER } = workrIntegrationConfig;
        const providedKey = req.header(API_KEY_HEADER);

        if(!API_KEY) {
            throw new InternalServerError('WORKR_INTEGRATION_API_KEY is not configured');
        }

        if(!providedKey || !safeCompareSecrets(providedKey, API_KEY)) {
            throw new UnauthorizedError('Unauthorized WorkR request');
        }

        next();
    } catch (error) {
        next(error);
    }
}
