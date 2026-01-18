import { ProductDto } from './product';

export interface OrderItemDto {
    productId: string; // UUID
    product: ProductDto;
    quantity: number;
    unitNetPrice: number;
    vatRate: number;
    currency: string;
    totalNetPrice: number;
    totalVatAmount: number;
    totalGrossPrice: number;
}
