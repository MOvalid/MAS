/**
 * Formats a Date object to a string in DD-MM-YYYY format.
 * Returns '—' if the date is null or undefined.
 */
export const formatDate = (date?: Date | null): string => {
    if (!date) return '—';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

/**
 * Formats a Date object to a string in HH:MM format.
 * Returns '—' if the date is null or undefined.
 */
export const formatTime = (date?: Date | null): string => {
    if (!date) return '—';
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

/**
 * Formats a numeric amount to a string with 2 decimal places.
 * Optionally appends a currency symbol.
 */
export const formatCurrency = (amount: number, currency?: string): string => {
    const formatted = amount.toFixed(2);
    return currency ? `${formatted} ${currency}` : formatted;
};
