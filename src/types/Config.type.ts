export type ServerConfig = {
    PORT: number
    NODE_ENV?: string
    REDIS_PORT: number,
    REDIS_HOST: string
}

export type QueueConfig = {
    JOB_ATTEMPTS: number
    RETRY_BACKOFF_MS: number
    FAILED_JOB_RETENTION_DAYS: number
    FAILED_JOB_RETENTION_COUNT: number
}

export type DBConfig = {
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_NAME: string
}

export type FrontendConfig = {
    ADMIN_FRONTEND_URL: string,
    CANDIDATE_FRONTEND_URL: string,
}

export type InternalApiConfig = {
    INTERNAL_API_KEY: string
    INTERNAL_API_KEY_HEADER: string
}

export type InternalServiceConfig = {
    BASE_URL: string
    TIMEOUT_MS: number
}

 
// Settings of the VSL abandonment follow-up chain.
export type VslConfig = {
    // Master switch: when false, the VSL sweeper does nothing.
    ENABLED: boolean

    // When true, eligible candidates are logged but not enrolled in the database.
    ENROLLMENT_DRY_RUN: boolean

    // When true, due steps are not claimed or sent to the notification queue.
    DRY_RUN: boolean

    // How often the VSL sweeper runs.
    SWEEP_CRON: string

    // Length of one "day" of the chain in minutes.
    // Use 1440 for a 24-hour day; smaller values are useful during testing.
    STEP_UNIT_MINUTES: number

    // Minimum age of the popup submission before enrollment.
    ENROLL_MIN_AGE_MINUTES: number

    // Candidates whose popup is older than this are not enrolled.
    ENROLL_MAX_AGE_MINUTES: number

    // A step later than this threshold is skipped instead of being sent.
    TOO_LATE_MINUTES: number

    // Restrict emails to the configured sending hours.
    SEND_WINDOW_ENABLED: boolean
    SEND_WINDOW_START_HOUR: number
    SEND_WINDOW_END_HOUR: number

    // Only submissions from these form slugs are eligible.
    ELIGIBLE_FORM_SLUGS: string[]

    // Optional safety allowlist for test recipients.
    TEST_EMAIL_ALLOWLIST: string[]

    // Maximum number of candidates or steps handled per sweep.
    BATCH_SIZE: number
}

