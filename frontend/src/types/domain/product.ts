// types/domain/product.ts
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    category: Category;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt?: Date;
    tags: string[];
    imageUrl?: string;
    stockQuantity?: number;
}

export interface Category {
    id: string;
    name: string;
    parent?: Category;
}

export interface ProductTableRow {
    lp: number;
    id: string;
    name: string;
    categoryName: string;
    price: string;
    available: boolean;
    stockQuantity?: number;
}
