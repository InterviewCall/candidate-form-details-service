import { z } from 'zod';

import { lookupSubmissionsBodySchema } from '../validators/submissionLookup.validator';

export type LookupSubmissionsBodyDto = z.infer<typeof lookupSubmissionsBodySchema>;
