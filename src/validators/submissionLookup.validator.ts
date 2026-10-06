import { z } from 'zod';

import { MAX_LOOKUP_ANSWER_KEYS, MAX_LOOKUP_SUBMISSION_IDS } from '../constants/lookup';

export const lookupSubmissionsBodySchema = z.object({
    submissionIds: z.array(z.string().uuid()).max(MAX_LOOKUP_SUBMISSION_IDS),
    // Which answers to include, by question key. Leaving it out returns no answers at all.
    answerKeys: z.array(z.string().trim().min(1).max(100)).max(MAX_LOOKUP_ANSWER_KEYS).optional(),
});
