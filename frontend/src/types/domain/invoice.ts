import { Currency, InvoiceStatus } from '../common/enums';

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

export interface Invoice {
    id: string;
    title: string;
    number: string;
    issuedTo: string;
    issuedBy: string;
    client: ClientBillingData;
    currency: Currency;
    issueDate: Date;
    paymentDueDate: Date;
    paymentDate?: Date | null;
    status: InvoiceStatus;
    products: InvoiceProduct[];
    totalAmount: number;
}

export interface InvoiceTableRow {
    lp: number;
    id: string;
    issueDate: string;
    paymentDate?: string | null;
    number: string;
    amount: string;
    status: string;
}
