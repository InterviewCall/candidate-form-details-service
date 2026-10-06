import { col, fn } from 'sequelize';

// "Last activity" of a submission: when the form was submitted, or when it was started if it never was.
export const activityAt = () => fn('COALESCE', col('CandidateSubmission.submitted_at'), col('CandidateSubmission.created_at'));

// LIKE treats % and _ as wildcards, so a search for "50%" must not match everything.
export const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (character) => `\\${character}`);
