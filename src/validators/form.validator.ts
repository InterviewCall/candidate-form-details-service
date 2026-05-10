import { z } from 'zod';

import { QuestionType } from '../utils/enums/QuestionType';

const optionBasedQuestionTypes = [
    QuestionType.SELECT,
    QuestionType.RADIO,
    QuestionType.CHECKBOX,
];

export const createQualificationFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Form name is required')
        .max(150, 'Form name cannot exceed 150 characters'),

    slug: z
        .string()
        .trim()
        .min(3, 'Slug is required')
        .max(150, 'Slug cannot exceed 150 characters')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must contain lowercase letters, numbers, and hyphens only',
        ),

    segmentKey: z
        .string()
        .trim()
        .min(2, 'Segment key is required')
        .max(80, 'Segment key cannot exceed 80 characters')
        .regex(
            /^[a-z0-9_]+$/,
            'Segment key must contain lowercase letters, numbers, and underscore only',
        ),

    description: z
        .string()
        .trim()
        .max(3000, 'Description is too long')
        .optional()
        .nullable(),

    version: z
        .number()
        .int('Version must be an integer')
        .positive('Version must be positive')
        .optional(),

    isActive: z.boolean().optional(),
});

export const addQuestionOptionSchema = z.object({
    optionLabel: z
        .string()
        .trim()
        .min(1, 'Option label is required')
        .max(255, 'Option label cannot exceed 255 characters'),

    optionValue: z
        .string()
        .trim()
        .min(1, 'Option value is required')
        .max(150, 'Option value cannot exceed 150 characters')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Option value can contain only letters, numbers, underscore, and hyphen',
        ),

    score: z
        .number()
        .int('Score must be an integer')
        .optional()
        .nullable(),

    sortOrder: z
        .number()
        .int('Sort order must be an integer')
        .positive('Sort order must be positive')
        .optional(),

    isActive: z.boolean().optional(),
});

export const addQuestionToFormParamsSchema = z.object({
    formId: z.coerce
        .number()
        .int('Form id must be an integer')
        .positive('Form id must be positive'),
});

export const addQuestionToFormSchema = z
    .object({
        stepNo: z
            .number()
            .int('Step number must be an integer')
            .min(2, 'Step number must be at least 2')
            .max(8, 'Step number cannot be greater than 8'),

        questionKey: z
            .string()
            .trim()
            .min(2, 'Question key is required')
            .max(100, 'Question key cannot exceed 100 characters')
            .regex(
                /^[a-zA-Z][a-zA-Z0-9_]*$/,
                'Question key must start with a letter and contain only letters, numbers, and underscore',
            ),

        questionText: z
            .string()
            .trim()
            .min(5, 'Question text is required')
            .max(1000, 'Question text is too long'),

        helperText: z
            .string()
            .trim()
            .max(1000, 'Helper text is too long')
            .optional()
            .nullable(),

        questionType: z.nativeEnum(QuestionType),

        isRequired: z.boolean().optional(),

        sortOrder: z
            .number()
            .int('Sort order must be an integer')
            .positive('Sort order must be positive')
            .optional(),

        validationRules: z
            .record(z.string(), z.unknown())
            .optional()
            .nullable(),

        isActive: z.boolean().optional(),

        options: z
            .array(addQuestionOptionSchema)
            .optional()
            .default([]),
    })
    .superRefine((data, ctx) => {
        const needsOptions = optionBasedQuestionTypes.includes(data.questionType);

        if (needsOptions && data.options.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options'],
                message: `${data.questionType} questions must have at least one option`,
            });
        }

        if (!needsOptions && data.options.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options'],
                message: `${data.questionType} questions cannot have options`,
            });
        }

        const optionValues = data.options.map((option) => option.optionValue);
        const uniqueOptionValues = new Set(optionValues);

        if (optionValues.length !== uniqueOptionValues.size) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options'],
                message: 'Option values must be unique inside one question',
            });
        }
    });

export const createFormQuestionOptionParamsSchema = z.object({
    questionId: z.coerce
        .number()
        .int('Question id must be an integer')
        .positive('Question id must be positive'),
});

export const createFormQuestionOptionSchema = z.object({
    optionLabel: z
        .string()
        .trim()
        .min(1, 'Option label is required')
        .max(255, 'Option label cannot exceed 255 characters'),

    optionValue: z
        .string()
        .trim()
        .min(1, 'Option value is required')
        .max(150, 'Option value cannot exceed 150 characters')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Option value can contain only letters, numbers, underscore, and hyphen',
        ),

    score: z
        .number()
        .int('Score must be an integer')
        .optional()
        .nullable(),

    sortOrder: z
        .number()
        .int('Sort order must be an integer')
        .positive('Sort order must be positive')
        .optional(),

    isActive: z.boolean().optional(),
});

export const createManyFormQuestionOptionsSchema = z.object({
    options: z
        .array(createFormQuestionOptionSchema)
        .min(1, 'At least one option is required'),
}).superRefine((data, ctx) => {
    const optionValues = data.options.map((option) => option.optionValue);
    const uniqueOptionValues = new Set(optionValues);

    if (optionValues.length !== uniqueOptionValues.size) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['options'],
            message: 'Option values must be unique',
        });
    }
});