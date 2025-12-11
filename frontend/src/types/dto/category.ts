import { ProductDto } from '.';

export interface CategoryDto {
    id: string; // UUID
    name: string;
    description: string | null;
    products: ProductDto[] | null;
}
