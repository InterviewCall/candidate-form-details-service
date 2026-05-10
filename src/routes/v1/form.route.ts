import { Router } from 'express';

import formController from '../../controllers/form.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import { 
    addQuestionToFormParamsSchema,
    addQuestionToFormSchema,
    createQualificationFormSchema 
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

export default formRouter;