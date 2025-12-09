// // types/mappers/product.mapper.ts
import { ProductDto, StockProductDto } from '@/types/dto';
import { Product, Tag } from '@/types/domain';
import { Currency } from '@/types/common';
import { StockProductViewModel } from '@/types/view-model/product';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';

/**
 * Maps a {@link ProductDto} received from the API
 * into a typed {@link Product} domain model used internally in the application.
 *
 * @example
 * const dto: ProductDto = {
 *   id: "1",
 *   name: "Laptop",
 *   sku: "ABC-123",
 *   netPrice: 4500,
 *   grossPrice: 5535,
 *   vatRate: 23,
 *   vatAmount: 1035,
 *   currency: "PLN"
 * }
 *
 * const product = mapProductDtoToDomain(dto)
 * // → { id: "1", name: "Laptop", sku: "ABC-123", netPrice: 4500, ... }
 *
 * @param dto - The raw {@link ProductDto} object received from the backend.
 * @returns A clean, strongly typed {@link Product} domain object.
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
 * Maps a {@link StockProductDto} received from the API
 * into a presentation-ready {@link StockProductViewModel}.
 *
 * This mapper belongs to the *presentation layer*.
 * It performs UI-specific formatting:
 *
 * - converts prices into formatted strings (e.g. "123,45 zł"),
 * - formats ISO date strings into Polish locale–friendly format,
 * - ensures that missing manufacturer data shows a placeholder "—",
 * - leaves numeric values as-is when they must remain sortable,
 * - isolates the UI from DTO structure changes.
 *
 * Thanks to this mapper:
 * - the UI never receives raw API numeric prices,
 * - all displayed text is already formatted,
 * - components like tables stay clean and logic-free.
 *
 * @example
 * const vm = mapStockProductToViewModel(dto)
 * // → { grossPrice: "199,99 zł", lastRestocked: "12.02.2025", ... }
 *
 * @param dto - Raw {@link StockProductDto} returned from the backend.
 * @returns The formatted {@link StockProductViewModel} for UI rendering.
 */
export const mapStockProductToViewModel = (dto: StockProductDto): StockProductViewModel => {
    return {
        id: dto.id,
        name: dto.name,
        manufacturerName: dto.manufacturer?.name ?? '—',
        stockQuantity: dto.stockQuantity,
        unit: dto.unit,
        netPrice: formatPrice(dto.netPrice),
        grossPrice: formatPrice(dto.grossPrice),
        currency: dto.currency,
        lastRestocked: dto.lastRestockedAt ? formatPolishDate(dto.lastRestockedAt, false) : '—',
    };
};

/**
 * Maps an array of {@link StockProductDto} items into an array of
 * presentation-layer {@link StockProductViewModel} objects.
 *
 * This is a convenience wrapper for list mapping.
 *
 * @example
 * mapStockList(dtoArray)
 * // → [{ id: "1", name: "Produkt 1", grossPrice: "10,00 zł" }, ...]
 *
 * @param list - Array of DTO objects from API.
 * @returns Array of mapped view models for UI usage.
 */
export const mapStockList = (list: StockProductDto[]): StockProductViewModel[] =>
    list.map(mapStockProductToViewModel);
