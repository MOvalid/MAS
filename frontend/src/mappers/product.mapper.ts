// // types/mappers/product.mapper.ts
import { ProductDetails, ProductSpecification, StockProduct } from '@/types/domain';
import {
    ProductDto,
    ProductSpecificationDto,
    StockProductDto,
    StockProductResponseDto,
} from '@/types/dto';
import { ProductViewModel, StockProductViewModel } from '@/types/view-model/product';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';
import { mapCompanyDtoToDomain } from './company.mapper';

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
export const mapStockProductDtoToViewModel = (dto: StockProductDto): StockProductViewModel => {
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
export const mapStockProductDtoListToViewModel = (
    list: StockProductDto[]
): StockProductViewModel[] => list.map(mapStockProductDtoToViewModel);

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

export const mapProductStockResponseDto = (
    response: StockProductResponseDto
): { items: StockProduct[]; total: number } => {
    const items: StockProduct[] = response.data.map(
        (p: StockProductDto): StockProduct => ({
            id: p.id,
            name: p.name,
            manufacturer: mapCompanyDtoToDomain(p.manufacturer), // ✅ CAŁY OBIEKT
            stockQuantity: p.stockQuantity,
            unit: p.unit,
            netPrice: p.netPrice,
            grossPrice: p.grossPrice,
            currency: p.currency,
            lastRestockedAt: p.lastRestockedAt,
        })
    );

    return {
        items,
        total: response.total,
    };
};

export const mapStockProductDtoToDomain = (dto: StockProductDto): StockProduct => {
    return {
        id: dto.id,
        name: dto.name,
        manufacturer: mapCompanyDtoToDomain(dto.manufacturer),
        stockQuantity: dto.stockQuantity,
        unit: dto.unit,
        netPrice: dto.netPrice,
        grossPrice: dto.grossPrice,
        currency: dto.currency,
        lastRestockedAt: dto.lastRestockedAt,
    };
};

export const mapStockProductListDtoToDomain = (dtos: StockProductDto[]): StockProduct[] => {
    return dtos.map(mapStockProductDtoToDomain);
};

export const mapStockProductToViewModel = (product: StockProduct): StockProductViewModel => ({
    id: product.id,
    name: product.name,
    manufacturerName: product.manufacturer.name,
    stockQuantity: product.stockQuantity,
    unit: product.unit,
    netPrice: formatPrice(product.netPrice),
    grossPrice: formatPrice(product.grossPrice),
    currency: product.currency,
    lastRestocked: product.lastRestockedAt ? formatPolishDate(product.lastRestockedAt) : '-',
});

export const mapStockProductListToViewModel = (list: StockProduct[]): StockProductViewModel[] =>
    list.map(mapStockProductToViewModel);

/**
 * Maps ProductSpecificationDto to ProductSpecification domain model
 */
const mapProductSpecificationDtoToDomain = (dto: ProductSpecificationDto): ProductSpecification => {
    return {
        productId: dto.productId,
        weight: dto.weight,
        dimensions: dto.dimensions
            ? {
                  length: dto.dimensions.length || 0,
                  width: dto.dimensions.width || 0,
                  height: dto.dimensions.height || 0,
              }
            : undefined,
        material: dto.material,
        color: dto.color,
        manufacturer: dto.manufacturer,
        countryOfOrigin: dto.countryOfOrigin,
        warranty: dto.warranty,
    };
};

/**
 * Maps ProductDto and ProductSpecificationDto to ProductDetails domain model
 * @param productDto - Main product data
 * @param specificationDto - Optional product specification data
 */
export const mapProductDetailsDtoToDomain = (
    productDto: ProductDto,
    specificationDto: ProductSpecificationDto | null
): ProductDetails => {
    return {
        // Basic product info
        id: productDto.id,
        name: productDto.name,
        sku: productDto.sku,
        stockQuantity: productDto.stockQuantity,
        description: productDto.description,
        categoryId: productDto.categoryId,

        // Category object is not included in DTO
        // If you need it, fetch it separately or include in ProductDto response
        category: undefined,

        // Pricing
        netPrice: productDto.netPrice,
        vatRate: productDto.vatRate,
        grossPrice: productDto.grossPrice,
        vatAmount: productDto.vatAmount,
        currency: productDto.currency,

        // Image
        imageUrl: productDto.imageUrl,

        // Specification (map if exists, otherwise null)
        specification: specificationDto
            ? mapProductSpecificationDtoToDomain(specificationDto)
            : null,

        lastRestockedAt: productDto.lastRestockedAt,
    };
};
