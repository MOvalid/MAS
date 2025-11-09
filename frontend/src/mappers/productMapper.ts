// types/mappers/product.ts
import { Product, Category } from '@/types/domain/product';
import { ApiProduct, ApiCategory } from '@/types/api/product';

export function mapCategoryApiToDomain(
    api: ApiCategory,
    categoryMap: Record<string, ApiCategory>
): Category {
    return {
        id: api.id,
        name: api.name,
        parent: api.parent_id
            ? mapCategoryApiToDomain(categoryMap[api.parent_id], categoryMap)
            : undefined,
    };
}

export function mapProductApiToDomain(
    api: ApiProduct,
    categoryMap: Record<string, ApiCategory>
): Product {
    const categoryApi = categoryMap[api.category_id];
    return {
        id: api.id,
        name: api.name,
        description: api.description,
        price: api.price / 100,
        currency: api.currency,
        category: mapCategoryApiToDomain(categoryApi, categoryMap),
        isAvailable: api.available,
        createdAt: new Date(api.created_at),
        updatedAt: api.updated_at ? new Date(api.updated_at) : undefined,
        tags: api.tags || [],
        imageUrl: api.image_url,
        stockQuantity: api.stock_quantity,
    };
}

export function mapProductsApiToDomain(
    apis: ApiProduct[],
    categoryMap: Record<string, ApiCategory>
): Product[] {
    return apis.map((api) => mapProductApiToDomain(api, categoryMap));
}
