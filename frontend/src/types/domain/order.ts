import { OrderItem, Payment } from '.';

export interface Order {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customerId: string;
    sellerId: string;
    deliveryId: string | null;
    invoiceId: string | null;
    orderProducts: OrderItem[] | null;
    payments: Payment[] | null;
}

export type OrderSortOption =
    | 'CREATED_DESC'
    | 'CREATED_ASC'
    | 'CUSTOMER_ASC'
    | 'CUSTOMER_DESC'
    | 'COMPANY_ASC'
    | 'COMPANY_DESC';
