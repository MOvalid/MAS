import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { Seller } from '@/types/domain/seller';
import { SellerDto } from '@/types/dto/seller';
import { mapSellerDtoToDomain } from '@/mappers/seller.mapper';
import { API_SELLERS } from '@/constants/Endpoints';

/**
 * Hook to fetch list of sellers
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSellers = (enabled: boolean = true) => {
    const { api } = useAuth();

    const [data, setData] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSellers = useCallback(async () => {
        if (!api) {
            console.warn('[useSellers] API client not available.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('[useSellers] Fetching sellers:', API_SELLERS);
            const response = await api.get<SellerDto[]>(API_SELLERS);

            const mapped = (response.data ?? []).map(mapSellerDtoToDomain);
            console.log('[useSellers] Mapped sellers:', mapped);

            setData(mapped);
        } catch (err: unknown) {
            console.error('[useSellers] Error fetching sellers:', err);
            const friendlyMessage = getFriendlyErrorMessage(err);
            setError(friendlyMessage.message ?? 'Nieznany błąd');
            setData([]);
        } finally {
            setLoading(false);
            console.log('[useSellers] Fetch finished. Loading set to false.');
        }
    }, [api]);

    useEffect(() => {
        if (enabled) {
            fetchSellers();
        }
    }, [fetchSellers, enabled]);

    return {
        data,
        loading,
        error,
        refetch: fetchSellers,
    };
};
