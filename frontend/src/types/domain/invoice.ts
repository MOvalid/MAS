import { Company } from './company';
import { Order2 } from './order';

export type InvoiceTableData = {
    lp: string;
    id: string
    issuedAt: string;
    orderId: string;
    paymentDueDate: string;
    invoiceNumber: string;
    totalGrossPrice: string;
    currency: string;
    statusLabel: string;
    status: string;
};

export interface Invoice {
    id: string; // UUID
    invoiceNumber: string;
    orderId: string;
    companyId: string;
    issuedAt: string; // ISO datetime
    status: string;
    paymentDueDate: string; // ISO datetime
    totalNetPrice: number;
    totalVatAmount: number;
    totalGrossPrice: number;
}

export interface InvoiceDetails {
    id: string;
    invoiceNumber: string;
    order: Order2;
    company: Company;
    issuedAt: string; // ISO datetime
    paymentDueDate: string; // ISO datetime
    status: string;
    statusLabel: string;
}
