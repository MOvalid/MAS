// types/domain/product.ts

import { Category } from "./category";

export interface ProductTableRow {
    lp: number;
    id: string;
    name: string;
    categoryName: string;
    price: string;
    available: boolean;
    stockQuantity?: number;
}

export interface Tag {
    id: string; // UUID
    name: string;
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

export interface ProductSpecification {
    weight?: number; // kg
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    material?: string;
    color?: string;
    manufacturer?: string;
    countryOfOrigin?: string;
    warranty?: number;
    ean?: string;
}

export interface ProductDetails {
    id: string; // UUID
    name: string;
    sku: string;
    stockQuantity: number;
    description: string | null;
    categoryId: string | null;
    category?: Category;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;

    imageUrl?: string;
    specification?: ProductSpecification;

    createdAt?: string; // ISO date
    updatedAt?: string; // ISO date
    lastRestockedAt?: string;
}
