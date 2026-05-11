import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AddQuestionToFormDto, AddQuestionToFormParamsDto, CreateQualificationFormDto } from '../dtos/Form.dto';
import FormQuestionRepository from '../repositories/FormQuestion.repository';
import FormQuestionOptionRepository from '../repositories/FormQuestionOption.repository';
import QualificationFormRepository from '../repositories/QualificationForm.repository';
import FormService from '../services/Form.service';
import { AddQuestionToFormResponse, QualificationFormResponse } from '../types/Response.type';
import { buildSuccessResponse } from '../utils/helpers/response.helper';

const formService = new FormService(new QualificationFormRepository(), new FormQuestionRepository(), new FormQuestionOptionRepository());

async function createQualificationFormHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const formDetails = req.body as CreateQualificationFormDto;
        const response = await formService.createQualificationForm(formDetails);
        res.status(StatusCodes.CREATED).json(
            buildSuccessResponse<QualificationFormResponse>('Form is saved successfully', response)
        );
    } catch (error) {
        next(error);
    }
}

async function addQuestionToFormHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { formId } = req.params as unknown as AddQuestionToFormParamsDto;
        const questionDetails = req.body as AddQuestionToFormDto;
        const response = await formService.addQuestionOptionsToForm(formId, questionDetails);
        res.status(StatusCodes.OK).json(
            buildSuccessResponse<AddQuestionToFormResponse>('Question is added to the form successfully', response)
        );
    } catch (error) {
        next(error);
    }
}

export default {
    createQualificationFormHandler,
    addQuestionToFormHandler,
};