// // types/mappers/product.mapper.ts
import { ProductDto, StockProductDto } from '@/types/dto';
import { ProductViewModel, StockProductViewModel } from '@/types/view-model/product';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';

/**
 * Maps a {@link StockProductDto} received from the API
 * into a presentation-ready {@link StockProductViewModel}.
 *
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
 * @example
 * mapStockList(dtoArray)
 * // → [{ id: "1", name: "Produkt 1", grossPrice: "10,00 zł" }, ...]
 *
 * @param list - Array of DTO objects from API.
 * @returns Array of mapped view models for UI usage.
 */
export const mapStockList = (list: StockProductDto[]): StockProductViewModel[] =>
    list.map(mapStockProductToViewModel);

/**
 * Maps a {@link ProductDto} returned from the backend
 * into a presentation-ready {@link ProductViewModel}.
 *
 * @example
 * const vm = mapProductToViewModel(dto);
 * // → { name: "Laptop X", grossPrice: "3 999,00 zł", lastRestocked: "02.01.2025", ... }
 *
 * @param dto - Raw {@link ProductDto} received from API.
 * @returns A formatted {@link ProductViewModel} used by the UI layer.
 */
export const mapProductDtoToViewModel = (dto: ProductDto, lp?: number): ProductViewModel => {
    return {
        lp: lp ?? 0,
        id: dto.id,
        name: dto.name,
        manufacturer: dto.manufacturer || '—',
        sku: dto.sku,
        description: dto.description ?? '—',
        netPrice: formatPrice(dto.netPrice),
        grossPrice: formatPrice(dto.grossPrice),
        vatAmount: formatPrice(dto.vatAmount),
        vatRate: `${dto.vatRate}%`,
        currency: dto.currency,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        lastRestocked: dto.lastRestockedAt ? formatPolishDate(dto.lastRestockedAt, false) : '—',
    };
};

/**
 * Maps an array of {@link ProductDto} objects into an array of
 * UI-ready {@link ProductViewModel} models.
 *
 *
 * @example
 * const list = mapProductList(dtoArray);
 * // → [{ id: "1", name: "Produkt A", grossPrice: "19,99 zł" }, ...]
 *
 * @param list - List of DTOs from backend.
 * @returns An array of mapped view models.
 */
export const mapProductListToViewModel = (list: ProductDto[]): ProductViewModel[] =>
    list.map((dto, index) => ({
        ...mapProductDtoToViewModel(dto),
        lp: index + 1,
    }));
