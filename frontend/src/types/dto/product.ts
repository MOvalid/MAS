// types/api/product.ts

import { CompanyDto } from './company';

export interface ProductDto {
    id: string; // UUID
    name: string;
    manufacturer: string;
    sku: string;
    stockQuantity: number;
    description: string | null;
    categoryId: string | null; // UUID
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
    imageUrl: string | null;
    lastRestockedAt: string | null;
}

export interface Dimensions {
    length: number | null;
    width: number | null;
    height: number | null;
}

export interface ProductSpecificationDto {
    productId: string; // UUID
    weight: number | null; // kg
    dimensions: Dimensions | null;
    material: string | null;
    color: string | null;
    manufacturer: string | null;
    countryOfOrigin: string | null;
    warranty: number | null;
}

export interface StockProductDto {
    id: string;
    name: string;
    manufacturer: CompanyDto;
    stockQuantity: number;
    unit: string;
    netPrice: number;
    grossPrice: number;
    currency: string;
    lastRestockedAt: string | null;
}

export interface StockProductResponseDto {
    data: StockProductDto[];
    total: number;
    page: number;
    limit: number;
}
