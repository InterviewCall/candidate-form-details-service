import { z } from 'zod';

const optionalText = (maxLength: number) => {
    return z.preprocess(
        (value) => {
            if (typeof value !== 'string') {
                return value;
            }

            const trimmedValue = value.trim();

            return trimmedValue.length > 0 ? trimmedValue : undefined;
        },
        z.string().max(maxLength).optional(),
    );
};

export const createCandidateSchema = z
    .object({
        slug: z
            .string()
            .trim()
            .min(1, { message: 'Form slug is required' })
            .max(150, { message: 'Form slug is too long' }),

        fullName: z
            .string()
            .trim()
            .min(2, { message: 'Full name must be at least 2 characters' })
            .max(150, { message: 'Full name must be at most 150 characters' }),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .pipe(z.string().email({ message: 'Please enter a valid email address' })),

        phone: z
            .string()
            .trim()
            .transform((value) => value.replace(/[\s()-]/g, ''))
            .refine((value) => /^\+?[1-9]\d{9,14}$/.test(value), {
                message: 'Please enter a valid WhatsApp number',
            }),

        source: optionalText(100),

        landingPage: optionalText(2048),

        referrerUrl: optionalText(2048),

        utmSource: optionalText(100),

        utmMedium: optionalText(100),

        utmCampaign: optionalText(150),

        utmContent: optionalText(150),

        utmTerm: optionalText(150),

        gclid: optionalText(255),

        fbclid: optionalText(255),
    })
    .strict();

const optionalTextSchema = z.preprocess(
    (value) => {
        if (typeof value !== 'string') {
            return value;
        }

        const trimmedValue = value.trim();

        return trimmedValue.length > 0 ? trimmedValue : undefined;
    },
    z
        .string({
            message: 'Answer text must be a string',
        })
        .max(2000, {
            message: 'Answer text must be at most 2000 characters',
        })
        .optional(),
);

export const createCandidateAnswerSchema = z
    .object({
        questionId: z
            .number({
                message: 'Question id is required',
            })
            .int({
                message: 'Question id must be an integer',
            })
            .positive({
                message: 'Question id must be a positive number',
            }),

        questionKey: z
            .string({
                message: 'Question key is required',
            })
            .trim()
            .min(1, {
                message: 'Question key is required',
            })
            .max(100, {
                message: 'Question key must be at most 100 characters',
            }),

        answerText: optionalTextSchema,

        answerJson: z
            .record(z.string(), z.unknown(), {
                message: 'Answer JSON must be a valid object',
            })
            .nullish(),

        selectedOptionId: z
            .number({
                message: 'Selected option id must be a number',
            })
            .int({
                message: 'Selected option id must be an integer',
            })
            .positive({
                message: 'Selected option id must be a positive number',
            })
            .nullish(),
    })
    .strict()
    .superRefine((value, context) => {
        if (!value.answerText && !value.answerJson && !value.selectedOptionId) {
            context.addIssue({
                code: 'custom',
                path: ['answerText'],
                message:
                    'At least one answer value is required: answerText, answerJson, or selectedOptionId',
            });
        }
    });

export const createCandidateSubmissionParamsSchema = z.object({
    submissionId: z
        .string({
            message: 'Submission id is required',
        })
        .trim()
        .uuid({
            message: 'Invalid submission id',
        }),
});

export const createCandidateSubmissionSchema = z
    .object({
        answers: z
            .array(createCandidateAnswerSchema, {
                message: 'Answers must be an array',
            })
            .min(1, {
                message: 'At least one answer is required',
            }),
    })
    .strict();

export const getCandidateSubmissionParamsSchema = z.object({
    submissionId: z
        .string({
            message: 'Submission id is required',
        })
        .trim()
        .uuid({
            message: 'Invalid submission id',
        }),
});

export const getCandidateParamsSchema = z.object({
    candidateId: z.string().uuid({
        message: 'Candidate id must be a valid UUID',
    }),
});