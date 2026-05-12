import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number
    NODE_ENV?: string
    REDIS_PORT: number,
    REDIS_HOST: string
}

type DBConfig = {
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_NAME: string
}

type FrontendConfig = {
    FRONTEND_URL: string
}

dotenv.config();

export const serverConfig: ServerConfig =  {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV,
    REDIS_HOST: process.env.REDIS_Host || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379
};

export const dbConfig: DBConfig = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '1748arijiT#',
    DB_NAME: process.env.DB_NAME || 'ic_lead',
};

export const frontendConfig: FrontendConfig = {
    FRONTEND_URL: String(process.env.FRONTEND_URL)
};