import { useState, useEffect, useCallback } from 'react';
import { mapProductDetailsDtoToDomain } from '@/mappers/product.mapper';
import { API_PRODUCTS } from '@/constants/Endpoints';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { ProductDetails } from '@/types/domain/product';
import { ProductDto, ProductSpecificationDto } from '@/types/dto/product';
/**
 * Hook to fetch details of a single product (fetches both product and specification)
 * @param productId - UUID of the product to fetch
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useProductDetails = (productId: string | null, enabled: boolean = true) => {
    const { api } = useAuth();

    const [item, setItem] = useState<ProductDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const fetchDetails = useCallback(async () => {
        if (!productId) {
            console.log('[useProductDetails] No productId provided, skipping fetch.');
            setItem(null);
            setError(null);
            setNotFound(false);
            return;
        }

        setLoading(true);
        setError(null);
        setNotFound(false);

        try {
            const productUrl = `${API_PRODUCTS}/${productId}`;
            const specUrl = `${API_PRODUCTS}/${productId}/specification`;
            console.log('[useProductDetails] Fetching product details:', productUrl);
            console.log('[useProductDetails] Fetching product specification:', specUrl);

            const [productResponse, specificationResponse] = await Promise.all([
                api!.get<ProductDto>(`${API_PRODUCTS}/${productId}`),
                api!
                    .get<ProductSpecificationDto>(`${API_PRODUCTS}/${productId}/specification`)
                    .catch(() => {
                        console.log(
                            '[useProductDetails] Specification request failed, returning null.'
                        );
                        return { data: null };
                    }),
            ]);

            console.log('[useProductDetails] Product response:', productResponse);
            console.log('[useProductDetails] Specification response:', specificationResponse);

            const productDto = productResponse?.data;
            const specificationDto = specificationResponse?.data;

            const mapped = mapProductDetailsDtoToDomain(productDto, specificationDto);
            console.log('[useProductDetails] Mapped product details:', mapped);
            setItem(mapped);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                console.error('[useProductDetails] Error fetching product details:', err);
                const axiosError = err as { response?: { status: number } };
                if (axiosError.response?.status === 404) {
                    console.warn('[useProductDetails] Product not found (404).');
                    setNotFound(true);
                    setError('Produkt nie został znaleziony');
                    setItem(null);
                    return;
                }
            }

            const friendlyMessage = getFriendlyErrorMessage(err);
            setError(friendlyMessage.message ?? 'Nieznany błąd');
            setItem(null);
        } finally {
            setLoading(false);
            console.log('[useProductDetails] Fetch finished. Loading set to false.');
        }
    }, [api, productId]);

    useEffect(() => {
        if (enabled && productId) {
            fetchDetails();
        }
    }, [fetchDetails, enabled, productId]);

    return {
        item,
        loading,
        error,
        notFound,
        refetch: fetchDetails,
    };
};
