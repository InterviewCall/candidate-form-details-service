// Small readers for environment variables, so the config file stays easy to read.

// Reads a boolean value from .env.
// If the variable is missing or empty, uses the provided fallback.
export function readBooleanEnv(
    name: string,
    fallback: boolean,
): boolean {
    const value = process.env[name];

    if (value === undefined || value === '') {
        return fallback;
    }

    return value.toLowerCase() === 'true';
}

// Reads comma-separated values from .env.
// Example: "a@example.com, b@example.com"
// becomes ["a@example.com", "b@example.com"].
export function readListEnv(
    name: string,
    fallback: string[] = [],
): string[] {
    const value = process.env[name];

    if (!value) {
        return fallback;
    }

    return value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length > 0);
}
