import { getRedisClient } from './redis.config';

export const bullMqConnection = getRedisClient();
