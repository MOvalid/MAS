import { Currency } from '../common';
import { Product } from './product';

export interface OrderItem {
    productId: string; // UUID
    product: Product;
    quantity: number;
    unitNetPrice: number;
    vatRate: number;
    currency: Currency.PLN;
    totalNetPrice: number;
    totalVatAmount: number;
    totalGrossPrice: number;
}

export interface OrderItemTableData {
    lp: string;
    _index: number;
    product: string; // name
    quantity: number;
    unit: string;
    unitPrice: string;
    netPrice: string;
    vatAmount: string;
    vatRate: string;
    grossPrice: string;
    currency: string;
}
