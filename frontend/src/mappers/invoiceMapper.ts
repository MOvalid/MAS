import { ApiInvoice } from '../types/api';
import { Invoice } from '../types/domain';
import { Currency, InvoiceStatus } from '../types/common';

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


export const mapInvoiceToTableRow = (invoice: Invoice, index: number) => ({
  lp: index + 1,
  issueDate: formatDate(invoice.issueDate),
  paymentDate: invoice.paymentDate
    ? formatDate(invoice.paymentDate)
    : 'Nieopłacona',
  number: invoice.number,
  amount: `${invoice.totalAmount.toLocaleString('pl-PL')} ${invoice.currency}`,
  status: translateStatus(invoice.status),
});


const formatDate = (date?: Date | null) => {
  if (!date) return '—';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

const translateStatus = (status: InvoiceStatus): string => {
  switch (status) {
    case InvoiceStatus.PAID:
      return 'Opłacona';
    case InvoiceStatus.SENT:
      return 'Wysłana';
    case InvoiceStatus.OVERDUE:
      return 'Po terminie';
    case InvoiceStatus.DRAFT:
    default:
      return 'Robocza';
  }
};
