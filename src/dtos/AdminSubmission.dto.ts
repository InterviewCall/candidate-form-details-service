import { z } from 'zod';

import { adminSubmissionParamsSchema, adminSubmissionsQuerySchema } from '../validators/adminSubmission.validator';

export type AdminSubmissionsQueryDto = z.infer<typeof adminSubmissionsQuerySchema>;

export type AdminSubmissionParamsDto = z.infer<typeof adminSubmissionParamsSchema>;
