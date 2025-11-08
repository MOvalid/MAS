import { Currency, InvoiceStatus } from '../common/enums';


export interface ApiInvoiceProduct {
  id: string;
  name: string;
  quantity: number;
  net_price: number;
  vat_rate: number;
  vat_amount: number;
  gross_price: number;
}


export interface ApiInvoice {
  id: string;
  title: string;
  number: string;
  issued_to_email: string;
  issued_by_name: string;
  client_billing_data: {
    name: string;
    nip?: string;
    email?: string;
  };
  currency: keyof typeof Currency;
  issue_date: string;
  payment_due_date: string;
  payment_date?: string | null;
  status: keyof typeof InvoiceStatus;
  products: ApiInvoiceProduct[];
  total_amount: number;
}
