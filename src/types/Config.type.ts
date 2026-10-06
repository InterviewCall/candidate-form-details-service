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
