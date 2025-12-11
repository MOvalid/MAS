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
