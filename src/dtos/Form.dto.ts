import { z } from 'zod';

import { 
    addQuestionToFormParamsSchema, 
    addQuestionToFormSchema, 
    createFormQuestionOptionParamsSchema, 
    createFormQuestionOptionSchema, 
    createManyFormQuestionOptionsSchema, 
    createQualificationFormSchema, 
    getQualificationFormParamsSchema
} from '../validators/form.validator';

export type CreateQualificationFormDto = z.infer<typeof createQualificationFormSchema>;

export type AddQuestionToFormDto = z.infer<typeof addQuestionToFormSchema>;

export type AddQuestionToFormParamsDto = z.infer<typeof addQuestionToFormParamsSchema>;

export type GetQualificationFormParamsDto = z.infer<typeof getQualificationFormParamsSchema>;

export type CreateFormQuestionOptionInput = z.infer<typeof createFormQuestionOptionSchema>;

export type CreateManyFormQuestionOptionsInput = z.infer<typeof createManyFormQuestionOptionsSchema>;

export type CreateFormQuestionOptionParams = z.infer<typeof createFormQuestionOptionParamsSchema>;