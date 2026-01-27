export enum Currency {
    PLN = 'PLN',
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
}

export enum InvoiceStatus {
    ALL = 'All',
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    CANCELLED = 'Cancelled',
}

export enum OrderStatus {
    ALL = 'All',
    DRAFT = 'Draft',
    PAYMENT_PENDING = 'PendingPayment',
    PAID = 'Paid',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
    RETURNED = 'Returned',
}

export enum PaymentStatus {
    PENDING = 'Pending',
    PROCESSING = 'Processing',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    REFUNDED = 'Refunded',
    CANCELLED = 'Cancelled',
}

export enum PaymentMethod {
    BANK_TRANSFER = 'BankTransfer',
    CREDIT_CARD = 'CreditCard',
    CASH = 'Cash',
    PAYPAL = 'Paypal',
    BLIK = 'Blik',
    OTHER = 'Other',
}

export type PaymentSummaryStatus = 'PAID' | 'PARTIAL' | 'NONE' | 'OVERPAID';

export const INVOICE_STATUS_VALUES: InvoiceStatus[] = Object.values(InvoiceStatus);
export const ORDER_STATUS_VALUES: OrderStatus[] = Object.values(OrderStatus);
export const PAYMENT_STATUS_VALUES: PaymentStatus[] = Object.values(PaymentStatus);
export const PAYMENT_METHOD_VALUES: PaymentMethod[] = Object.values(PaymentMethod);
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.ALL]: 'Wszystkie',
    [OrderStatus.DRAFT]: 'Draft',
    [OrderStatus.PAYMENT_PENDING]: 'Oczekuje na płatność',
    [OrderStatus.PAID]: 'Opłacone',
    [OrderStatus.SHIPPED]: 'Wysłane',
    [OrderStatus.DELIVERED]: 'Dostarczone',
    [OrderStatus.CANCELLED]: 'Anulowane',
    [OrderStatus.RETURNED]: 'Zwrócone',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Oczekująca',
    [PaymentStatus.PROCESSING]: 'Przetwarzana',
    [PaymentStatus.COMPLETED]: 'Dokonana',
    [PaymentStatus.FAILED]: 'Nieudana',
    [PaymentStatus.REFUNDED]: 'Zwrócona',
    [PaymentStatus.CANCELLED]: 'Anulowana',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    [PaymentMethod.BANK_TRANSFER]: 'Przelew bankowy',
    [PaymentMethod.CREDIT_CARD]: 'Karta płatnicza',
    [PaymentMethod.CASH]: 'Gotówka',
    [PaymentMethod.PAYPAL]: 'PayPal',
    [PaymentMethod.BLIK]: 'Blik',
    [PaymentMethod.OTHER]: 'Inna',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
    [InvoiceStatus.ALL]: 'Wszystkie',
    [InvoiceStatus.DRAFT]: 'Szkic',
    [InvoiceStatus.SENT]: 'Wysłana',
    [InvoiceStatus.PAID]: 'Opłacona',
    [InvoiceStatus.OVERDUE]: 'Przeterminowana',
    [InvoiceStatus.CANCELLED]: 'Anulowana',
};

export const PAYMENT_METHODS = PAYMENT_METHOD_VALUES.map((m) => ({
    label: PAYMENT_METHOD_LABELS[m],
    value: m,
}));

export const PAYMENT_SUMMARY_LABELS = {
    PAID: 'Opłacone',
    PARTIAL: 'Częściowe',
    NONE: 'Brak wpłat',
    OVERPAID: 'Nadpłata',
} as const;

export const ORDER_SORT_OPTIONS = [
    { label: 'Zamawiający A → Z', value: 'CLIENT_ASC' },
    { label: 'Zamawiający Z → A', value: 'CLIENT_DESC' },
    { label: 'Data zamówienia ↑', value: 'CREATED_ASC' },
    { label: 'Data zamówienia ↓', value: 'CREATED_DESC' },
];

export type ProductSort =
    | 'NAME_ASC'
    | 'NAME_DESC'
    | 'MANUFACTURER_ASC'
    | 'MANUFACTURER_ASC'
    | 'PRICE_ASC'
    | 'PRICE_DESC'
    | 'STOCK_ASC'
    | 'STOCK_DESC';
export type OrderSort = 'CLIENT_ASC' | 'CLIENT_DESC' | 'CREATED_ASC' | 'CREATED_DESC';
export type CustomerSort = 'ALPHA_ASC' | 'ALPHA_DESC';
export type CompanySort = 'ALPHA_ASC' | 'ALPHA_DESC';
export type InvoiceSort =
    | 'ISSUED_ASC'
    | 'ISSUED_DESC'
    | 'PAYMENT_ASC'
    | 'PAYMENT_DESC'
    | 'AMOUNT_ASC'
    | 'AMOUNT_DESC';
