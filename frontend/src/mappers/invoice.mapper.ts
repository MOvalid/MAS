import { InvoiceDto, InvoiceSummaryDto } from '@/types/dto';
import { Invoice, InvoiceTableRow } from '@/types/domain';
import { InvoiceStatus } from '@/types/common';
import { formatCurrency, formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';

/**
 * Mapper: API → Domain (Invoice)
 */
export const mapInvoiceDtoToDomain = (dto: InvoiceDto): Invoice => ({
    id: dto.id,
    issuedAt: dto.issuedAt,
    status: InvoiceStatus[dto.status as keyof typeof InvoiceStatus],
});

/**
 * Converts an {@link InvoiceStatus} enum value into a human-readable label (Polish).
 *
 * Used primarily in UI components (e.g. tables or detail views)
 * to display the invoice status as a localized string.
 *
 * Example:
 *   InvoiceStatus.PAID → "Opłacona"
 *
 * @param status - The invoice status enum value.
 * @returns A localized string representing the invoice status.
 */
export const translateStatus = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.DRAFT:
            return 'Niewysłana';
        case InvoiceStatus.SENT:
            return 'Wysłana';
        case InvoiceStatus.PAID:
            return 'Opłacona';
        case InvoiceStatus.OVERDUE:
            return 'Przeterminowana';
        case InvoiceStatus.CANCELLED:
            return 'Anulowana';
        default:
            return 'Nieznany';
    }
};

/**
 * Converts a string representation of an {@link InvoiceStatus}
 * (usually received from API as a plain string) into a strongly typed enum value.
 *
 * Ensures that the domain layer works with enum-based logic rather than raw strings.
 *
 * @example
 *   convertStringToInvoiceStatus("PAID") // → InvoiceStatus.PAID
 *
 * @param statusString - The invoice status string from the API.
 * @returns The corresponding {@link InvoiceStatus} enum value.
 */
export const convertStringToInvoiceStatus = (statusString: string): InvoiceStatus => {
    return InvoiceStatus[statusString as keyof typeof InvoiceStatus];
};

/**
 * Maps an {@link InvoiceSummaryDto} object (received from API)
 * to a domain-friendly {@link InvoiceTableRow} used in UI components such as tables.
 *
 * Converts dates, currency values, and statuses into properly formatted and localized strings.
 *
 * @example
 *   mapInvoiceToTableRow(invoiceDto, 0)
 *   // → { lp: 1, id: "...", invoiceNumber: "...", issueDate: "11.11.2025", ... }
 *
 * @param invoice - The invoice DTO from the API.
 * @param index - The row index (used for LP column).
 * @returns The formatted {@link InvoiceTableRow} object for display.
 */
export const mapInvoiceSummaryDtoToTableRow = (
    invoice: InvoiceSummaryDto,
    index: number
): InvoiceTableRow => ({
    lp: index + 1,
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    issueDate: formatPolishDate(invoice.issuedAt, false),
    paymentDate: formatPolishDate(invoice.paymentDueDate, false),
    amount: formatPrice(invoice.totalGross),
    currency: invoice.currency,
    status: translateStatus(convertStringToInvoiceStatus(invoice.status)),
});
