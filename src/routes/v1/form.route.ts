import { Router } from 'express';

import formController from '../../controllers/form.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import { 
    addQuestionToFormParamsSchema,
    addQuestionToFormSchema,
    createQualificationFormSchema, 
    getQualificationFormParamsSchema
} from '../../validators/form.validator';

const formRouter = Router();

formRouter.post(
    '/forms', 
    validateRequestBody(createQualificationFormSchema), 
    formController.createQualificationFormHandler
);

formRouter.post(
    '/forms/:formId/questions', 
    validateRequestParams(addQuestionToFormParamsSchema), 
    validateRequestBody(addQuestionToFormSchema), 
    formController.addQuestionToFormHandler
);

formRouter.get(
    '/:slug',
    validateRequestParams(getQualificationFormParamsSchema),
    formController.getQualificationFormForCandidateHandler
);

export default formRouter;