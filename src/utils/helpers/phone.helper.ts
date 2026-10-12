// The last 10 digits of a phone number, whatever the prefix (+91, 91, spaces, dashes). Null when there are fewer than 10 digits.
// This is the part two systems agree on: this service stores "+919876543210" or "9876543210" as typed, WorkR stores 10 digits.
export function lastTenDigits(phone: string | null | undefined): string | null {
    const digits = (phone ?? '').replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : null;
}

// Every way this service may have stored an Indian number whose last 10 digits are given. Used for exact (indexable) lookups.
export function indianPhoneVariants(lastTen: string): string[] {
    return [lastTen, `91${lastTen}`, `+91${lastTen}`];
}
