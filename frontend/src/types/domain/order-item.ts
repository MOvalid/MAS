export interface OrderItem {
    orderId: string; // UUID
    productId: string; // UUID
    quantity: number;
    unitPrice: number;
}

export interface OrderItemDetails {
    orderId: string; // UUID
    productId: string; // UUID
    quantity: number;
    unitPrice: number;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
}
