// types/api/product.ts

export interface ProductDto {
    id: string; // UUID
    name: string;
    sku: string;
    stockQuantity: number;
    description?: string | null;
    categoryId?: string | null; // UUID
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
    tags?: {
        id: string; // UUID
        name: string;
    }[];
}
