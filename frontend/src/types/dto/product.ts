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
}

export interface ProductStockDto {
    id: string;
    productName: string;
    stockValue: number;
    unit: string;
}

export interface ProductStockResponseDto {
    items: ProductStockDto[];
    total: number;
    page: number;
    limit: number;
}
