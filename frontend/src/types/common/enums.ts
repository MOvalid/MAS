export enum Currency {
    PLN = 'PLN',
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
}

export enum InvoiceStatus {
    ALL = 'ALL',
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
}

export const INVOICE_STATUS_VALUES: InvoiceStatus[] = Object.values(InvoiceStatus);

export type ProductSortOption = 'NAME_ASC' | 'NAME_DESC' | 'MANUFACTURER_ASC' | 'PRICE_ASC';

export type ClientTypeFilter = 'ALL' | 'CUSTOMER' | 'COMPANY';
export type ClientSort = 'ALPHA_ASC' | 'ALPHA_DESC';


