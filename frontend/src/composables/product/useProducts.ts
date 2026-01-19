import { useCallback, useMemo } from 'react';
import {
    mapProductDetailsDtoToDomain,
    mapProductDtoToDomain,
    mapProductToStockTableData,
    mapProductToTableData,
} from '@/mappers/product.mapper';
import { API_PRODUCTS, API_STOCK } from '@/constants/Endpoints';
import { Product, ProductDetails, ProductTableData, StockProductTableData } from '@/types/domain/product';
import {
    CreateProductPayload,
    ProductDetailsDto,
    ProductDto,
    UpdateProductPayload,
} from '@/types/dto/product';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { useDelete } from '../common/useDelete';
import { useGet } from '../common/useGet';
import { usePaginated } from '../pagination/usePagination';
import { ProductSort } from '@/types/common';
import { useGetList } from '../common/useGetList';
import { useDebounce } from '@/hooks/useDebounce';

export const useCreateProduct = (
    onSuccess?: (productDetails: ProductDetails) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateProductPayload, ProductDetails, ProductDetailsDto>({
        endpoint: API_PRODUCTS,
        onSuccess,
        onError,
        transformResponse: mapProductDetailsDtoToDomain,
    });
};

export const useUpdateProduct = (
    onSuccess?: (productDetails: ProductDetails) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<UpdateProductPayload, UpdateProductPayload, ProductDetails, ProductDetailsDto>(
        {
            endpoint: API_PRODUCTS,
            onSuccess,
            onError,
            transformResponse: mapProductDetailsDtoToDomain,
        }
    );
};

export const useDeleteProduct = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_PRODUCTS,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const useProduct = (id?: string) => {
    return useGet<ProductDetails, ProductDetailsDto>({
        endpoint: API_PRODUCTS,
        id,
        transformResponse: mapProductDetailsDtoToDomain,
    });
};

export const useProducts = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<ProductDto, ProductSort>({
            endpoint: API_PRODUCTS,
            enabled,
            initialFilters,
        });

    const data = items.map(mapProductDtoToDomain);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProductOptions = (enabled = true, initialFilters: Record<string, any> = {}) => {
    const transformResponse = useCallback(
        (dtos: ProductDto[]) => dtos.map(mapProductDtoToDomain),
        []
    );

    const { data, loading, error, refresh, filters, setFilters } = useGetList<Product, ProductDto>({
        endpoint: API_PRODUCTS,
        enabled,
        initialFilters,
        transformResponse,
    });

    return {
        data,
        loading,
        error,
        refetch: refresh,
        filters,
        setFilters,
    };
};

export const useProductTableData = (
    products: Product[],
    page: number = 1,
    limit: number = 10
): ProductTableData[] => {
    return useMemo(() => {
        return products.map((dto, index) => mapProductToTableData(dto, index, page, limit));
    }, [products, page, limit]);
};


export const useStockProductTableData = (
    products: Product[],
    page: number = 1,
    limit: number = 10
): StockProductTableData[] => {
    return useMemo(() => {
        return products.map((dto, index) => mapProductToStockTableData(dto, index, page, limit));
    }, [products, page, limit]);
};
