import { CandidateSubmissionStatus } from '../utils/enums/CandidateSubmissionStatus';
import { LeadTemperature } from '../utils/enums/LeadTemperature';

// The date ranges of the admin list's range filter.
export type AdminDateRange = 'today' | '7d' | '30d' | 'all';

// Filters that decide which rows the admin list is about. The summary counts use only these.
export type AdminSubmissionBaseFilters = {
    formSlug: string
    source: string
    rangeStart: Date | null
}

// On top of the base filters, what the status tab, temperature chips and search box add.
export type AdminSubmissionPageFilters = AdminSubmissionBaseFilters & {
    status: CandidateSubmissionStatus | 'all'
    temperature: LeadTemperature | 'all'
    search: string
    page: number
    pageSize: number
}

// One row per status: how many submissions, and how many of them are hot.
export type AdminSubmissionStatusCountRow = {
    status: CandidateSubmissionStatus
    total: number | string
    hot: number | string | null
}
