import { OrderItemDto, PaymentDto } from '.';

export interface OrderDto {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customerId: string; // UUID
    sellerId: string; // UUID
    deliveryId?: string | null; // UUID
    invoiceId?: string | null; // UUID
    orderProducts?: OrderItemDto[] | null;
    payments?: PaymentDto[] | null;
}
