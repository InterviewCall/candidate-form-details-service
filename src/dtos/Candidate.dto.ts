import { z } from 'zod';

import { createCandidateSchema, createCandidateSubmissionParamsSchema, createCandidateSubmissionSchema } from '../validators/candidate.validator';

export type CreateCandidateDto = z.infer<typeof createCandidateSchema>;

export type CreateCandidateSubmissionDto = z.infer<typeof createCandidateSubmissionSchema>;

export type SubmissionIdDto = z.infer<typeof createCandidateSubmissionParamsSchema>;