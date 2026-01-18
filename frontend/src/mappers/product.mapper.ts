import { calculateVat, formatPrice } from '@/utils/price-utils';
import {
    Product,
    ProductDetails,
    ProductTableRow,
    ProductDimensions,
} from '../types/domain/product';
import { ProductDto, ProductDetailsDto, UpdateProductPayload } from '../types/dto/product';
import { mapCompanyDtoToDomain, mapCompanyToDto } from './company.mapper';
import { ProductCategory } from '@/types/domain';

export const mapProductDtoToDomain = (dto: ProductDto): Product => {
    const vatAmount = calculateVat(dto.netPrice, dto.vatRate);
    return {
        id: dto.id,
        name: dto.name,
        sku: dto.sku,
        stockQuantity: dto.stockQuantity,
        description: null,
        manufacturer: mapCompanyDtoToDomain(dto.manufacturer),
        categoryId: dto.categoryId,
        categoryName: null,
        netPrice: dto.netPrice,
        vatRate: dto.vatRate,
        vatAmount: vatAmount,
        grossPrice: dto.netPrice + vatAmount,
        currency: 'PLN',
        lastRestockedAt: null,
    };
};

/** ProductDetailsDto -> ProductDetails */
export const mapProductDetailsDtoToDomain = (dto: ProductDetailsDto): ProductDetails => {
    const vatAmount = calculateVat(dto.netPrice, dto.vatRate);
    return {
        id: dto.id,
        name: dto.name,
        sku: dto.sku,
        stockQuantity: dto.stockQuantity,
        description: dto.description,
        categoryId: dto.category.id,
        category: dto.category as ProductCategory,
        netPrice: dto.netPrice,
        vatRate: dto.vatRate,
        vatAmount: vatAmount,
        grossPrice: dto.netPrice + vatAmount,
        currency: 'PLN',
        imageUrl: null,
        manufacturer: mapCompanyDtoToDomain(dto.manufacturer),
        dimensions: dto.dimensions,
        lastRestockedAt: dto.lastRestockedAt,
    };
};

export const mapProductToDto = (product: Product): ProductDto => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    manufacturer: mapCompanyToDto(product.manufacturer),
    netPrice: product.netPrice,
    vatRate: product.vatRate,
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId ?? '',
});

export const mapProductToUpdatePayload = (
    product: Product,
    dimensions: ProductDimensions
): UpdateProductPayload => ({
    name: product.name,
    sku: product.sku,
    manufacturerId: product.manufacturer.id,
    netPrice: product.netPrice,
    vatRate: product.vatRate,
    stockQuantity: product.stockQuantity,
    description: product.description ?? '',
    categoryId: product.categoryId ?? '',
    dimensions: dimensions,
});

export const mapProductDetailsToUpdatePayload = (product: ProductDetails): UpdateProductPayload => {
    return {
        name: product.name,
        sku: product.sku,
        manufacturerId: product.manufacturer.id,
        netPrice: product.netPrice,
        vatRate: product.vatRate,
        stockQuantity: product.stockQuantity,
        dimensions: product.dimensions ?? {
            length: 0,
            width: 0,
            height: 0,
        },
        description: product.description ?? '',
        categoryId: product.categoryId ?? product.category.id,
    };
};

// export const mapProductToTableRow = (product: Product, index: number): ProductTableRow => ({
//     lp: index + 1,
//     id: product.id,
//     name: product.name,
//     categoryName: product.categoryName ?? 'Brak kategorii',
//     price: formatPrice(product.grossPrice),
//     currency: product.currency,
//     available: product.stockQuantity > 0,
//     stockQuantity: product.stockQuantity,
// });

export const mapProductToTableRow = (
    product: Product,
    index: number,
    page: number = 1,
    limit: number = 10
): ProductTableRow => {
    const rowNumber = (page - 1) * limit + index + 1;

    return {
        id: product.id,
        lp: rowNumber.toString(),
        name: product.name,
        manufacturer: product.manufacturer.name,
        categoryId: product.categoryId || '',
        netPrice: product.netPrice.toFixed(2),
        grossPrice: product.grossPrice.toFixed(2),
        currency: 'PLN',
        available: product.stockQuantity > 0,
        stockQuantity: product.stockQuantity,
    };
};
