/**
 * Converts a text containing numbers into a proper numeric format.
 * Removes all characters except digits, commas, or dots,
 * and converts commas to dots to facilitate parsing into a `number`.
 *
 * @example
 * sanitizeNumericInput("12,50 zł") // => "12.50"
 * sanitizeNumericInput("1 200,99") // => "1200.99"
 *
 * @param text - the raw text input by the user
 * @returns cleaned string ready for conversion to a number
 */
export const sanitizeNumericInput = (text: string): string => {
    return text.replace(/[^\d,.]/g, '').replace(',', '.');
};

/**
 * Calculates the VAT amount based on the net price and VAT rate.
 *
 * @example
 * calculateVat(100, 23) // => 23
 * calculateVat(199.99, 8) // => 15.9992
 *
 * @param netPrice - the net price of the product
 * @param vatRate - the VAT rate in percent (e.g., 23, 8)
 * @returns VAT value in the same unit as `netPrice`
 */
export const calculateVat = (netPrice: number, vatRate: number): number => {
    return (netPrice * vatRate) / 100;
};

/**
 * Formats a numeric value into a standardized price string.
 * Ensures two decimal places and optional thousands separators.
 *
 * Accepts both `number` and `string` inputs. When receiving a string,
 * the value is first cleaned using `sanitizeNumericInput` to remove
 * invalid characters before being converted into a number.
 *
 * This utility provides consistent price formatting across the system.
 *
 * @example
 * formatPrice(12.5)          // "12.50"
 * formatPrice("12,5")        // "12.50"
 * formatPrice(1200.5)        // "1 200.50"
 * formatPrice("1 200,99 zł") // "1 200.99"
 *
 * @param value - A numeric or string value to format
 * @returns A formatted price string (e.g. "123.45")
 */
export const formatPrice = (value: number | string): string => {
    if (value === null || value === undefined) return '0.00';

    let numericValue: number;

    if (typeof value === 'string') {
        const sanitized = sanitizeNumericInput(value);
        numericValue = Number(sanitized) || 0;
    } else {
        numericValue = value;
    }

    return numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
