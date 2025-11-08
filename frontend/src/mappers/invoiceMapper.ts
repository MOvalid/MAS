import { ApiInvoice } from '../types/api';
import { Invoice, InvoiceTableRow } from '../types/domain';
import { Currency, InvoiceStatus } from '../types/common';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Mapper: API → Domain (Invoice)
 */
export const mapApiInvoiceToDomain = (api: ApiInvoice): Invoice => ({
  id: api.id,
  title: api.title,
  number: api.number,
  issuedTo: api.issued_to_email,
  issuedBy: api.issued_by_name,
  client: {
    name: api.client_billing_data.name,
    nip: api.client_billing_data.nip,
    email: api.client_billing_data.email,
  },
  currency: Currency[api.currency as keyof typeof Currency],
  issueDate: new Date(api.issue_date),
  paymentDueDate: new Date(api.payment_due_date),
  paymentDate: api.payment_date ? new Date(api.payment_date) : null,
  status: InvoiceStatus[api.status as keyof typeof InvoiceStatus],
  products: api.products.map((p) => ({
    id: p.id,
    name: p.name,
    quantity: p.quantity,
    netPrice: p.net_price,
    vatRate: p.vat_rate,
    vatAmount: p.vat_amount,
    grossPrice: p.gross_price,
  })),
  totalAmount: api.total_amount,
});

/**
 * Mapper: Domain (Invoice) → TableRow (InvoiceTableRow)
 */
export const mapInvoiceToTableRow = (
  invoice: Invoice,
  index: number
): InvoiceTableRow => ({
  lp: index + 1,
  id: invoice.id,
  issueDate: formatDate(invoice.issueDate),
  paymentDate: invoice.paymentDate ? formatDate(invoice.paymentDate) : '—',
  number: invoice.number,
  amount: formatCurrency(invoice.totalAmount, invoice.currency),
  status: translateStatus(invoice.status),
});


/**
 * Translates an InvoiceStatus enum value to a human-readable string.
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
