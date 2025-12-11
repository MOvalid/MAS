import { Currency } from '../common';

export interface OrderItem {
    orderId: string;
    productName: string;
    productId: string; // UUID
    quantity: number;
    unitPrice: number;
}

export interface OrderItemDetails {
    orderId: string; // UUID
    productName: string;
    productId: string; // Product UUID
    quantity: number;
    unitPrice: number;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: Currency.PLN;
}
