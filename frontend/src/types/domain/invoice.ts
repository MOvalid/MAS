import { Address, Company, OrderItemDetails, Payment } from '.';
import { InvoiceStatus } from '../common';

export interface InvoiceProduct {
    id: string;
    name: string;
    quantity: number;
    netPrice: number;
    vatRate: number;
    vatAmount: number;
    grossPrice: number;
}

export interface ClientBillingData {
    name: string;
    nip?: string;
    email?: string;
}

export interface InvoiceTableRow {
    lp: number;
    id: string;
    issueDate: string;
    paymentDate?: string | null;
    invoiceNumber: string;
    amount: string;
    status: string;
}

export interface Invoice {
    id: string; // UUID
    issuedAt: string; // ISO datetime
    status: InvoiceStatus;
}

export interface InvoiceSummary {
    invoiceId: string; // UUID
    orderId: string; // UUID
    customerFirstName: string;
    customerLastName: string;
    customerAddress: Address;
    company: Company | null;
    issuedAt: string; // ISO datetime
    items: OrderItemDetails[];
    totalNet: number;
    totalVat: number;
    totalGross: number;
    currency: string;
    payments: Payment[] | null;
}
