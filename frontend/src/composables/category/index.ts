import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_CATEGORIES } from '@/constants/Endpoints';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { CategoryDto } from '@/types/dto/category';

/**
 * Hook to fetch list of product categories
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useCategories = (enabled: boolean = true) => {
    const { api } = useAuth();

    const [items, setItems] = useState<CategoryDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCategories = useCallback(async () => {
        if (!api) {
            console.warn('[useCategories] API client not available.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('[useCategories] Fetching categories:', API_CATEGORIES);
            const response = await api.get<CategoryDto[]>(API_CATEGORIES);

            console.log('[useCategories] Categories response:', response);
            setItems(response.data ?? []);
        } catch (err: unknown) {
            console.error('[useCategories] Error fetching categories:', err);
            const friendlyMessage = getFriendlyErrorMessage(err);
            setError(friendlyMessage.message ?? 'Nieznany błąd');
            setItems([]);
        } finally {
            setLoading(false);
            console.log('[useCategories] Fetch finished. Loading set to false.');
        }
    }, [api]);

    useEffect(() => {
        if (enabled) {
            fetchCategories();
        }
    }, [fetchCategories, enabled]);

    return {
        items,
        loading,
        error,
        refetch: fetchCategories,
    };
};
