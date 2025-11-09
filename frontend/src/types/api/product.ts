// types/api/product.ts
export interface ApiProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    category_id: string;
    available: boolean;
    created_at: string;
    updated_at?: string;
    tags?: string[];
    image_url?: string;
    stock_quantity?: number;
}

export interface ApiCategory {
    id: string;
    name: string;
    parent_id?: string;
}
