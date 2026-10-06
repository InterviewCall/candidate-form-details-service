import { z } from 'zod';

import { MAX_ADMIN_PAGE_SIZE } from '../constants/adminSubmission';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { LeadTemperature } from '../utils/enums/LeadTemperature';

// Every filter is optional: leaving it out means "all".
export const adminSubmissionsQuerySchema = z.object({
    status: z
        .union([z.literal('all'), z.nativeEnum(CandidateSubmissionStatus)])
        .default('all'),

    temperature: z
        .union([z.literal('all'), z.nativeEnum(LeadTemperature)])
        .default('all'),

    formSlug: z
        .string()
        .trim()
        .max(150, 'formSlug is too long')
        .default('all'),

    source: z
        .string()
        .trim()
        .max(100, 'source is too long')
        .default('all'),

    range: z
        .enum(['today', '7d', '30d', 'all'])
        .default('all'),

    search: z
        .string()
        .trim()
        .max(150, 'search is too long')
        .default(''),

    page: z.coerce
        .number()
        .int('page must be an integer')
        .min(1, 'page must be at least 1')
        .default(1),

    pageSize: z.coerce
        .number()
        .int('pageSize must be an integer')
        .min(1, 'pageSize must be at least 1')
        .max(MAX_ADMIN_PAGE_SIZE, `pageSize cannot be more than ${MAX_ADMIN_PAGE_SIZE}`)
        .default(10),
});

export const adminSubmissionParamsSchema = z.object({
    publicId: z
        .string({ message: 'Submission id is required' })
        .trim()
        .uuid({ message: 'Submission id must be a valid UUID' }),
});
