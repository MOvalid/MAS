import {
    CompanyDto,
    CustomerDto,
    DeliveryDto,
    InvoiceDto,
    OrderItemDto,
    PaymentDto,
    SellerDto,
} from '.';

export interface OrderDto {
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
    customer: CustomerDto | null;
    company: CompanyDto | null;
    status: string;
    seller: SellerDto;
    delivery: DeliveryDto | null;
    invoice: InvoiceDto | null;
    orderItems: OrderItemDto[] | null;
    payments: PaymentDto[] | null;
}
