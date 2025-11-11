// // types/mappers/product.ts
// import { Product, Category } from '@/types/domain/product';
// import { ApiProduct, ApiCategory } from '@/types/dto/product';

// export function mapCategoryApiToDomain(
//     api: ApiCategory,
//     categoryMap: Record<string, ApiCategory>
// ): Category {
//     return {
//         id: api.id,
//         name: api.name,
//         parent: api.parent_id
//             ? mapCategoryApiToDomain(categoryMap[api.parent_id], categoryMap)
//             : undefined,
//     };
// }

// export function mapProductApiToDomain(
//     api: ApiProduct,
//     categoryMap: Record<string, ApiCategory>
// ): Product {
//     const categoryApi = categoryMap[api.category_id];
//     return {
//         id: api.id,
//         name: api.name,
//         description: api.description,
//         price: api.price / 100,
//         currency: api.currency,
//         category: mapCategoryApiToDomain(categoryApi, categoryMap),
//         isAvailable: api.available,
//         createdAt: new Date(api.created_at),
//         updatedAt: api.updated_at ? new Date(api.updated_at) : undefined,
//         tags: api.tags || [],
//         imageUrl: api.image_url,
//         stockQuantity: api.stock_quantity,
//     };
// }

// export function mapProductsApiToDomain(
//     apis: ApiProduct[],
//     categoryMap: Record<string, ApiCategory>
// ): Product[] {
//     return apis.map((api) => mapProductApiToDomain(api, categoryMap));
// }

import { ProductDto } from '@/types/dto';
import { Product } from '@/types/domain';
import { Currency } from '@/types/common';

/**
 * Maps a {@link ProductDto} received from the API
 * to a strongly typed {@link Product} domain model used in the application.
 *
 * Converts all numeric and enum-like fields to proper TypeScript types
 * and ensures consistent value formats across the domain layer.
 *
 * @example
 *   mapProductDtoToDomain(apiProduct)
 *   // → { id: "...", name: "Laptop", netPrice: 4500, vatRate: 23, ... }
 *
 * @param dto - The {@link ProductDto} received from the API.
 * @returns The mapped {@link Product} domain object.
 */
export const mapProductDtoToDomain = (dto: ProductDto): Product => ({
    id: dto.id,
    name: dto.name,
    sku: dto.sku,
    stockQuantity: dto.stockQuantity,
    description: dto.description ?? null,
    categoryId: dto.categoryId ?? null,
    netPrice: dto.netPrice,
    vatRate: dto.vatRate,
    grossPrice: dto.grossPrice,
    vatAmount: dto.vatAmount,
    currency: Currency[dto.currency as keyof typeof Currency],
});

/**
 * Maps a {@link Product} domain model
 * back into a {@link ProductDto} for API requests (e.g., create or update).
 *
 * Converts enums and numeric fields into API-friendly formats.
 *
 * @example
 *   mapProductDomainToDto(domainProduct)
 *   // → { id: "...", name: "Laptop", currency: "PLN", ... }
 *
 * @param product - The {@link Product} domain object.
 * @returns The corresponding {@link ProductDto} ready to be sent to the API.
 */
export const mapProductDomainToDto = (product: Product): ProductDto => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    stockQuantity: product.stockQuantity,
    description: product.description,
    categoryId: product.categoryId,
    netPrice: product.netPrice,
    vatRate: product.vatRate,
    grossPrice: product.grossPrice,
    vatAmount: product.vatAmount,
    currency: product.currency,
});
