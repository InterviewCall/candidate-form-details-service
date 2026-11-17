/**
 * Queues the people who registered BEFORE the CRM connection was switched on, so they reach the CRM too.
 *
 *   npm run crm:backfill -- --since=2026-10-01        (development)
 *   node dist/scripts/crmBackfill.js --since=2026-10-01   (production image)
 *
 * It only writes rows to crm_outbox; the running service sends them. Safe to run again: every event has a fixed id,
 * so the queue and the CRM both ignore what they already have. Without --since, everyone is queued.
 */
import { Op } from 'sequelize';

import setupAssociations from '../db/models/associations';
import CandidateSubmission from '../db/models/CandidateSubmission.model';
import sequelize from '../db/models/sequelize';
import CrmOutboxRepository from '../repositories/CrmOutbox.repository';
import { CRM_EVENT_DETAILS, CRM_EVENT_FORM, eventIdFor } from '../services/CrmSync.service';
import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';

async function main(): Promise<void> {
    const sinceArg = process.argv.find((arg) => arg.startsWith('--since='))?.slice('--since='.length);
    const since = sinceArg ? new Date(sinceArg) : null;
    if (since && Number.isNaN(since.getTime())) {
        throw new Error(`--since must be a date like 2026-10-01, got "${sinceArg}"`);
    }

    setupAssociations();
    await sequelize.authenticate();

    const outbox = new CrmOutboxRepository();
    const PAGE = 500;
    let lastId = 0;
    let details = 0;
    let forms = 0;

    for (;;) {
        const rows = await CandidateSubmission.findAll({
            where: { id: { [Op.gt]: lastId }, ...(since ? { createdAt: { [Op.gte]: since } } : {}) },
            attributes: ['id', 'publicId', 'status', 'submittedAt'],
            order: [['id', 'ASC']],
            limit: PAGE
        });
        if (rows.length === 0) {
            break;
        }

        for (const row of rows) {
            if (await outbox.enqueue(eventIdFor(CRM_EVENT_DETAILS, row.publicId), CRM_EVENT_DETAILS, row.publicId)) {
                details += 1;
            }

            const filled = row.submittedAt !== null && row.status !== CandidateSubmissionStatus.SUBMISSION_PENDING;
            if (filled && (await outbox.enqueue(eventIdFor(CRM_EVENT_FORM, row.publicId), CRM_EVENT_FORM, row.publicId))) {
                forms += 1;
            }
        }
        lastId = Number(rows[rows.length - 1].id);
    }

    console.log(`Queued ${details} "gave details" and ${forms} "filled the form" events${since ? ` since ${since.toISOString()}` : ''}.`);
    console.log('They are sent by the running service, a few at a time. Check progress in crm_outbox (status PENDING -> SENT).');
    await sequelize.close();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
