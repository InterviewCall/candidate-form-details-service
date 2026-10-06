import axios from 'axios';

// What to log when another service fails: its HTTP status and its own error message, so the cause is visible here.
export function describeLookupError(error: unknown): { error: string, status?: number, serviceMessage?: string } {
    if (axios.isAxiosError(error)) {
        return {
            error: error.message,
            status: error.response?.status,
            serviceMessage: (error.response?.data as { message?: string } | undefined)?.message,
        };
    }

    return { error: error instanceof Error ? error.message : String(error) };
}
