import { ProductDto } from './product';

export interface OrderItemDto {
    orderId: string; // UUID
    product: ProductDto;
    quantity: number;
    unitPrice: number;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
}
