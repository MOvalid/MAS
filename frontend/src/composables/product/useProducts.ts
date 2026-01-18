import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    mapProductDetailsDtoToDomain,
    mapProductDetailsToUpdatePayload,
    mapProductDtoToDomain,
    mapProductToTableRow,
} from '@/mappers/product.mapper';
import { API_PRODUCTS } from '@/constants/Endpoints';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import {
    Product,
    ProductDetails,
    ProductDimensions,
    ProductTableRow,
} from '@/types/domain/product';
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

export const useProductTableData = (
    productDtos: Product[],
    page: number = 1,
    limit: number = 10
): ProductTableRow[] => {
    return useMemo(() => {
        return productDtos.map((dto, index) => mapProductToTableRow(dto, index, page, limit));
    }, [productDtos, page, limit]);
};
