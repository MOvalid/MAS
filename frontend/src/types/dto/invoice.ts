import { CompanyDto } from "./company";
import { OrderDto2 } from "./order";

export interface InvoiceDto {
    id: string; // UUID
    invoiceNumber: string;
    orderId: string;
    companyId: string;
    issuedAt: string; // ISO datetime
    status: string;
    paymentDueDate: string; // ISO datetime
}

export interface InvoiceDetailsDto {
    id: string;
    invoiceNumber: string;
    order: OrderDto2;
    company: CompanyDto;
    issuedAt: string; // ISO date
    paymentDueDate: string; // ISO date
    status: string;
}


export interface CreateInvoicePayload {
    companyId: string;
    orderId: string;
}

export interface UpdateInvoicePayload {
    status: string;
}
