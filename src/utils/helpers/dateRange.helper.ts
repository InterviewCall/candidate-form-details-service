import { AdminDateRange } from '../../types/AdminSubmissionFilter.type';

const IST_OFFSET_IN_MS = 330 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const DAYS_BACK_BY_RANGE: Record<Exclude<AdminDateRange, 'all'>, number> = {
    'today': 0,
    '7d': 6,
    '30d': 29,
};

/**
 * Start of the range as a real point in time (UTC), counted in IST calendar days:
 * "today" starts at 00:00 IST today, "7d" at 00:00 IST six days ago (7 days including today), and so on.
 * Returns null for "all", meaning no lower bound.
 */
export function getRangeStart(range: AdminDateRange, now: Date = new Date()): Date | null {
    if (range === 'all') {
        return null;
    }

    const istNow = now.getTime() + IST_OFFSET_IN_MS;
    const istMidnightToday = Math.floor(istNow / DAY_IN_MS) * DAY_IN_MS;
    const istRangeStart = istMidnightToday - DAYS_BACK_BY_RANGE[range] * DAY_IN_MS;

    return new Date(istRangeStart - IST_OFFSET_IN_MS);
}
