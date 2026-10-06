import axios from 'axios';

import { bookingServiceConfig, internalApiConfig, notificationServiceConfig } from './server.config';

// Service-to-service calls carry the shared secret in the configured header.
const internalHeaders = {
    'Content-Type': 'application/json',
    [internalApiConfig.INTERNAL_API_KEY_HEADER]: internalApiConfig.INTERNAL_API_KEY
};

export const bookingServiceApi = axios.create({
    baseURL: bookingServiceConfig.BASE_URL,
    timeout: bookingServiceConfig.TIMEOUT_MS,
    headers: internalHeaders
});

export const notificationServiceApi = axios.create({
    baseURL: notificationServiceConfig.BASE_URL,
    timeout: notificationServiceConfig.TIMEOUT_MS,
    headers: internalHeaders
});
