import { CustomerDto, DeliveryDto, InvoiceDto, OrderItemDto, PaymentDto, SellerDto } from '.';

export interface OrderDto1 {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customerId: string;
    sellerId: string;
    currency: string;
    status: string;
    totalNetPrice: number;
    totalGrossPrice: number;
    totalVatAmount: number;
}


export interface OrderDto2 {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customer: string | null;
    company: string | null;
    status: string;
    seller: string; // UUID
    deliveryId: string | null; // UUID
    invoiceNumber: string | null;
}

export interface OrderSummaryDto {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customer: CustomerDto;
    status: string;
    currency: string;
    seller: SellerDto;
    totalNetPrice: number;
    totalVatAmount: number;
    totalGrossPrice: number;
    delivery: DeliveryDto | null;
    invoice: InvoiceDto | null;
    orderProducts: OrderItemDto[] | null;
    payments: PaymentDto[] | null;
}

export interface CreateOrderItem {
    productId: string;
    quantity: number;
}

export interface CreateOrderPayload {
    customerId: string;
    sellerId: string;
    currency: string;
    orderProducts: CreateOrderItem[]
}

export interface UpdateOrderPayload {
    id: string;
    status: string;
}
