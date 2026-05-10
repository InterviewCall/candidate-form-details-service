import { NextFunction,Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodTypeAny } from 'zod';

import logger from '../configs/logger.config';

/**
 * 
 * @param schema - Zod Schema to validate the Request Body
 * @returns - Middlewarefunction to validate the Request Body
 */

export const validateRequestBody = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
        //If validation fails 
        logger.error('Invalid Request Structure', { recievedStructure: req.body });
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Request Body',
            error
        });
    }
};

export const validateRequestQuery = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.query);
        next();
    } catch (error) {
        //If validation fails 
        logger.error('Invalid Request Structure', { recievedStructure: req.query });
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Request Query',
            error
        });
    }
};

export const validateRequestParams = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.params);
        next();
    } catch (error) {
        //If validation fails 
        logger.error('Invalid Request Structure', { recievedStructure: req.params });
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Request Params',
            error
        });
    }
};