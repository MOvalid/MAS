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
