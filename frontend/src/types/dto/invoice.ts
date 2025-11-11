import { AddressDto, CompanyDto, OrderItemDetailsDto, PaymentDto } from '.';
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

export interface InvoiceDto {
    id: string; // UUID
    issuedAt: string; // ISO datetime
    status: string;
    paymentDueDate: string; // ISO datetime
}

export interface InvoiceSummaryDto {
    id: string; // UUID
    invoiceNumber: string;
    orderId: string; // UUID
    customerFirstName: string;
    customerLastName: string;
    customerAddress: AddressDto;
    company?: CompanyDto | null;
    status: string;
    issuedAt: string; // ISO datetime
    paymentDueDate: string; // ISO datetime
    items: OrderItemDetailsDto[];
    totalNet: number;
    totalVat: number;
    totalGross: number;
    currency: string;
    payments?: PaymentDto[] | null;
}
