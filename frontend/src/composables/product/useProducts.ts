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
// /**
//  * Hook to fetch details of a single product (fetches both product and specification)
//  * @param productId - UUID of the product to fetch
//  * @param enabled - Whether to fetch immediately (default: true)
//  */
// export const useProductDetails = (productId: string | null, enabled: boolean = true) => {
//     const { api } = useAuth();

//     const [item, setItem] = useState<ProductDetails | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [notFound, setNotFound] = useState<boolean>(false);

//     const fetchDetails = useCallback(async () => {
//         if (!productId) {
//             console.log('[useProductDetails] No productId provided, skipping fetch.');
//             setItem(null);
//             setError(null);
//             setNotFound(false);
//             return;
//         }

//         setLoading(true);
//         setError(null);
//         setNotFound(false);

//         try {
//             const productUrl = `${API_PRODUCTS}/${productId}`;
//             const specUrl = `${API_PRODUCTS}/${productId}/specification`;
//             console.log('[useProductDetails] Fetching product details:', productUrl);
//             console.log('[useProductDetails] Fetching product specification:', specUrl);

//             const [productResponse, specificationResponse] = await Promise.all([
//                 api!.get<ProductDto>(`${API_PRODUCTS}/${productId}`),
//                 api!
//                     .get<ProductSpecificationDto>(`${API_PRODUCTS}/${productId}/specification`)
//                     .catch(() => {
//                         console.log(
//                             '[useProductDetails] Specification request failed, returning null.'
//                         );
//                         return { data: null };
//                     }),
//             ]);

//             console.log('[useProductDetails] Product response:', productResponse);
//             console.log('[useProductDetails] Specification response:', specificationResponse);

//             const productDto = productResponse?.data;
//             const specificationDto = specificationResponse?.data;

//             const mapped = joinProductDetailsDtoToDomain(productDto, specificationDto);
//             console.log('[useProductDetails] Mapped product details:', mapped);
//             setItem(mapped);
//         } catch (err: unknown) {
//             if (err && typeof err === 'object' && 'response' in err) {
//                 console.error('[useProductDetails] Error fetching product details:', err);
//                 const axiosError = err as { response?: { status: number } };
//                 if (axiosError.response?.status === 404) {
//                     console.warn('[useProductDetails] Product not found (404).');
//                     setNotFound(true);
//                     setError('Produkt nie został znaleziony');
//                     setItem(null);
//                     return;
//                 }
//             }

//             const friendlyMessage = getFriendlyErrorMessage(err);
//             setError(friendlyMessage.message ?? 'Nieznany błąd');
//             setItem(null);
//         } finally {
//             setLoading(false);
//             console.log('[useProductDetails] Fetch finished. Loading set to false.');
//         }
//     }, [api, productId]);

//     useEffect(() => {
//         if (enabled && productId) {
//             fetchDetails();
//         }
//     }, [fetchDetails, enabled, productId]);

//     return {
//         item,
//         loading,
//         error,
//         notFound,
//         refetch: fetchDetails,
//     };
// };

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
