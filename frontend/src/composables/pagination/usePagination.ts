import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

export type BaseFilters<TSort> = {
    search?: string;
    sortBy?: TSort;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export interface UsePaginatedProps<T, TSort> {
    endpoint: string;
    enabled?: boolean;
    initialFilters?: BaseFilters<TSort>;
    initialPage?: number;
    initialLimit?: number;
}

export function usePaginated<T, TSort>({
    endpoint,
    enabled = true,
    initialFilters = {} as BaseFilters<TSort>,
    initialPage = 1,
    initialLimit = 10,
}: UsePaginatedProps<T, TSort>) {
    const { api } = useAuth();

    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);
    const [limit, setLimit] = useState<number>(initialLimit);
    const [filters, setFilters] = useState<BaseFilters<TSort>>(initialFilters);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!api) return;

        setLoading(true);
        setError(null);

        console.log(
            `[usePaginated] Fetching ${endpoint} | page=${page} | limit=${limit} | filters=`,
            filters
        );

        try {
            const response = await api.get<PaginatedResponse<T>>(endpoint, {
                params: {
                    page,
                    limit,
                    ...filters,
                },
            });

            setItems(response.data.items ?? []);
            setTotal(response.data.total ?? 0);
        } catch (err: unknown) {
            console.error(`[usePaginated] Error fetching ${endpoint}:`, err);
            const friendly = getFriendlyErrorMessage(err);
            setError(friendly.message ?? 'Nieznany błąd');
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [api, endpoint, page, limit, filters]);

    useEffect(() => {
        if (enabled) fetchData();
    }, [fetchData, enabled]);

    return {
        items,
        total,
        page,
        setPage,
        limit,
        setLimit,
        filters,
        setFilters,
        loading,
        error,
        refetch: fetchData,
        setItems,
    };
}
