// types/domain/product.ts

export interface ProductTableRow {
    lp: number;
    id: string;
    name: string;
    categoryName: string;
    price: string;
    available: boolean;
    stockQuantity?: number;
}

export interface Product {
    id: string; // UUID
    name: string;
    sku: string;
    stockQuantity: number;
    description: string | null;
    categoryId: string | null;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
}
