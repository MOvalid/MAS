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

export enum OrderStatus {
    ALL = 'ALL',
    DRAFT = 'DRAFT',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    PAID = 'PAID',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    CASH = 'CASH',
    PAYPAL = 'PAYPAL',
    BLIK = 'BLIK',
    OTHER = 'OTHER',
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
    [OrderStatus.PROCESSING]: 'W realizacji',
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

export const PAYMENT_METHODS = PAYMENT_METHOD_VALUES.map((m) => ({
    label: PAYMENT_METHOD_LABELS[m],
    value: m,
}));

export const PAYMENT_SUMMARY_LABELS = {
    PAID: 'OPŁACONE',
    PARTIAL: 'CZĘŚCIOWE',
    NONE: 'BRAK WPŁAT',
    OVERPAID: 'NADPŁATA',
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
    | 'PRICE_DESC';
export type StockProductSortOption =
    | 'NAME_ASC'
    | 'NAME_DESC'
    | 'MANUFACTURER_ASC'
    | 'MANUFACTURER_ASC'
    | 'PRICE_ASC'
    | 'PRICE_DESC';
export type OrderSortOption = 'CLIENT_ASC' | 'CLIENT_DESC' | 'CREATED_ASC' | 'CREATED_DESC';
export type CustomerSort = 'ALPHA_ASC' | 'ALPHA_DESC';
export type CompanySort = 'ALPHA_ASC' | 'ALPHA_DESC';
