import { ProductDto } from '.';

export interface ProductCategoryDto {
    id: string; // UUID
    name: string;
    description: string | null;
}

export interface CategoryDto extends ProductCategoryDto {
    products: ProductDto[] | null;
}
