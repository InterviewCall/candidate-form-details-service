import { z } from 'zod';

import { createCandidateSchema, createCandidateSubmissionParamsSchema, createCandidateSubmissionSchema, getCandidateParamsSchema, getCandidateSubmissionParamsSchema } from '../validators/candidate.validator';

export type CreateCandidateDto = z.infer<typeof createCandidateSchema>;

export type CreateCandidateSubmissionDto = z.infer<typeof createCandidateSubmissionSchema>;

export type CreateSubmissionIdDto = z.infer<typeof createCandidateSubmissionParamsSchema>;

export type GetSubmissionIdDto = z.infer<typeof getCandidateSubmissionParamsSchema>;

export type GetCandidateDto = z.infer<typeof getCandidateParamsSchema>;