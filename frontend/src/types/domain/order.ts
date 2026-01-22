import { Customer, Delivery, Invoice, OrderItem, Payment, Seller } from '.';
import { CustomerDto, DeliveryDto, InvoiceDto, OrderItemDto, PaymentDto, SellerDto } from '../dto';

export interface Order1 {
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

export interface Order2 {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customer: string;
    company: string;
    seller: string;
    status: string;
    deliveryId: string;
    invoiceNUmber: string;
}

export interface OrderTableData {
    lp: number;
    id: string;
    createdAt: string;
    customer: string;
    company: string;
    status: string;
    statusLabel: string;
    seller: string;
    invoiceNumber: string;
}

export interface OrderSummary {
    id: string; // UUID
    createdAt: string; // ISO datetime
    customer: Customer;
    status: string;
    currency: string;
    seller: Seller;
    totalNetPrice: number;
    totalVatAmount: number;
    totalGrossPrice: number;
    delivery: Delivery | null;
    invoice: Invoice | null;
    orderProducts: OrderItem[] | null;
    payments: Payment[] | null;
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

export type OrderSortOption =
    | 'CREATED_DESC'
    | 'CREATED_ASC'
    | 'CUSTOMER_ASC'
    | 'CUSTOMER_DESC'
    | 'COMPANY_ASC'
    | 'COMPANY_DESC';
