import { Currency } from '@/types/common/enums';

/**
 * Formats a {@link Date} object into a string using the "DD-MM-YYYY" format.
 * Example:
 *   new Date('2025-11-11') → "11-11-2025"
 *
 * Returns "—" if the input is null or undefined.
 *
 * @param date - The Date object to format.
 * @returns A formatted date string in "DD-MM-YYYY" format or "—" if invalid.
 */
export const formatDate = (date?: Date | null): string => {
    if (!date) return '—';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

/**
 * Formats a {@link Date} object into a string using the "HH:MM" (24-hour) format.
 * Example:
 *   new Date('2025-11-11T08:30:00') → "08:30"
 *
 * Returns "—" if the input is null or undefined.
 *
 * @param date - The Date object to format.
 * @returns A formatted time string in "HH:MM" format or "—" if invalid.
 */
export const formatTime = (date?: Date | null): string => {
    if (!date) return '—';
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

/**
 * Formats an ISO datetime string into a Polish date (with optional time).
 *
 * Example:
 *   formatPolishDate("2025-11-11T13:45:00Z")        → "11.11.2025, 14:45"
 *   formatPolishDate("2025-11-11T13:45:00Z", false) → "11.11.2025"
 *
 * @param isoString - ISO datetime string to format.
 * @param withTime - Whether to include the time (default: true).
 * @returns A formatted date string according to the Polish locale.
 */
export function formatPolishDate(isoString: string, withTime = true): string {
    if (!isoString) return '';

    const date = new Date(isoString);
    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(withTime && { hour: '2-digit', minute: '2-digit' }),
    });
}

/**
 * Formats a numeric amount to a string with exactly two decimal places.
 * Optionally appends a currency code or symbol at the end.
 *
 * Commonly used for displaying prices or totals in invoices, orders, or reports.
 *
 * @example
 *   formatCurrency(1234.5, "PLN") // → "1234.50 PLN"
 *   formatCurrency(99.9)          // → "99.90"
 *
 * @param amount - The numeric value to format.
 * @param currency - (Optional) The currency code or symbol to append.
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currency?: string): string => {
    const formatted = amount.toFixed(2);
    return currency ? `${formatted} ${currency}` : formatted;
};

/**
 * Formats a numeric value into a human-readable string using Polish-style number formatting.
 * Uses a comma as the decimal separator and spaces as thousands separators.
 *
 * Commonly used for quantities, VAT rates, or numeric summaries.
 *
 * @example
 *   formatNumber(1234567.89) // → "1 234 567,89"
 *
 * @param num - The number to format.
 * @returns A string formatted according to Polish numeric conventions.
 */
export const formatNumber = (num: number): string => {
    return num
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Converts a string representation of a {@link Currency} enum value
 * (typically received from API as plain text) into a strongly typed enum.
 *
 * Ensures consistency between DTOs and domain models when working with currency values.
 *
 * @example
 *   convertStringToCurrency("PLN") // → Currency.PLN
 *
 * @param currencyString - The currency string from the API (e.g., "PLN", "EUR").
 * @returns The corresponding {@link Currency} enum value.
 */
export const convertStringToCurrency = (currencyString: string): Currency => {
    return Currency[currencyString as keyof typeof Currency];
};
