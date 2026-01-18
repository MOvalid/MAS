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
    product: string; // name
    quantity: number;
    unit: string;
    unitPrice: string;
    netPrice: string;
    vat: string;
    vatRate: string;
    grossPrice: string;
    currency: string;
}
