import { ProductCategoryDto } from '.';
import { ProductDimensions } from '../domain';
import { CompanyDto } from './company';

export interface ProductDto {
    id: string;
    name: string;
    sku: string;
    manufacturer: CompanyDto;
    netPrice: number;
    vatRate: number;
    stockQuantity: number;
    stockLevel: string;
    categoryId: string;
}

export interface ProductDetailsDto {
    id: string;
    name: string;
    sku: string;
    description: string;
    manufacturer: CompanyDto;
    netPrice: number;
    vatRate: number;
    stockQuantity: number;
    dimensions: ProductDimensions;
    lastRestockedAt: string;
    category: ProductCategoryDto;
}

export interface CreateProductPayload {
    name: string;
    sku: string;
    manufacturerId: string;
    netPrice: number;
    vatRate: number;
    stockQuantity: number;
    dimensions: ProductDimensions;
    description: string;
    categoryId: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductSpecificationPayload {
    manufacturer?: string;
    countryOfOrigin?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    material?: string;
    color?: string;
    warranty?: number;
}
