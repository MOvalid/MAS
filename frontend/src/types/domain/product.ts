import { ProductCategory, Company } from '.';

export interface ProductTableData {
    lp: string;
    id: string;
    name: string;
    manufacturer: string;
    categoryId: string;
    netPrice: string;
    grossPrice: string;
    currency: string;
    available: boolean;
    stockQuantity: number;
}
export interface Product {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    stockLevel: string;
    description: string | null;
    manufacturer: Company;
    categoryId: string | null;
    categoryName: string | null;
    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;
    lastRestockedAt: string;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
}

export interface ProductSpecification {
    productId: string;
    weight: number | null;
    dimensions: ProductDimensions;
    material: string | null;
    color: string | null;
    countryOfOrigin: string | null;
    warranty: number | null;
}

export interface ProductDetails {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    description: string | null;
    categoryId: string | null;
    category: ProductCategory;

    netPrice: number;
    vatRate: number;
    grossPrice: number;
    vatAmount: number;
    currency: string;

    imageUrl: string | null;
    manufacturer: Company;
    // specification: ProductSpecification | null;
    dimensions: ProductDimensions

    lastRestockedAt: string | null;
}

export interface StockProductTableData {
    lp: string;
    id: string;
    name: string;
    sku: string;
    manufacturerName: string;
    stockQuantity: number;
    stockLevel: string;
    unit: string;
    netPrice: string;
    grossPrice: string;
    currency: string;
    lastRestockedAt: string;
}
