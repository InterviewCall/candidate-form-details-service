import { z } from 'zod';

import { MAX_ENGAGEMENT_CONTACTS } from '../constants/lookup';

// Deliberately lenient about the email and phone: one odd contact must not reject the whole batch.
// An address that is not valid simply matches nobody here, so that contact is answered "not registered".
export const workrEngagementBodySchema = z.object({
    contacts: z.array(
        z.object({
            // WorkR's own id for the user; echoed back untouched so WorkR can pair answers with its rows.
            ref: z.string().trim().min(1).max(64),
            email: z.string().trim().toLowerCase().min(1).max(150),
            phone: z.string().trim().max(30).optional(),
        })
    ).min(1).max(MAX_ENGAGEMENT_CONTACTS),
});
