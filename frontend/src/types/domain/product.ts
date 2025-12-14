// types/domain/product.ts

import { Category } from './category';
import { Company } from './company';

export interface ProductTableRow {
    lp: number;
    id: string;
    name: string;
    categoryName: string;
    price: string;
    available: boolean;
    stockQuantity: number;
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
    lastRestockedAt: string | null;
}

export interface ProductSpecification {
    productId: string; // UUID
    weight: number | null; // kg
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    material: string | null;
    color: string | null;
    manufacturer: string | null;
    countryOfOrigin: string | null;
    warranty: number | null;
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

    imageUrl: string | null;
    specification: ProductSpecification | null;

    createdAt: string | null; // ISO date
    updatedAt: string | null; // ISO date
    lastRestockedAt: string | null;
}

export type ProductOption = {
    label: string;
    value: string;
    unitPrice: number;
};

export interface StockProduct {
    id: string;
    name: string;
    manufacturer: Company;
    stockQuantity: number;
    unit: string;
    netPrice: number;
    grossPrice: number;
    currency: string;
    lastRestockedAt: string | null;
}

export type ProductSortField = 'name' | 'stock';
