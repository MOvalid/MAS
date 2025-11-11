import { Product } from './product';

export interface Category {
    id: string; // UUID
    name: string;
    description: string | null;
    products: Product[] | null;
}
