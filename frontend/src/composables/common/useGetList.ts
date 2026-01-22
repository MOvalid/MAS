import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { PaginatedResponse } from '../pagination/usePagination';

export interface UseGetListOptions<TDomain, TDto = TDomain> {
    endpoint: string;
    enabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialFilters?: Record<string, any>;
    transformResponse?: (dtos: TDto[]) => TDomain[];
    onSuccess?: (data: TDomain[]) => void;
    onError?: (error: string) => void;
}

export const useGetList = <TDomain, TDto = TDomain>({
    endpoint,
    enabled = true,
    initialFilters = {},
    transformResponse,
    onSuccess,
    onError,
}: UseGetListOptions<TDomain, TDto>) => {
    const { api } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TDomain[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filters, setFiltersState] = useState<Record<string, any>>(initialFilters);

    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const transformResponseRef = useRef(transformResponse);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        transformResponseRef.current = transformResponse;
    }, [transformResponse]);

    const debouncedFilters = useDebounce(filters, 500);

    const activeFilters = debouncedFilters;
    const filtersKey = JSON.stringify(debouncedFilters);

    const fetch = useCallback(async () => {
        if (!api) {
            console.warn('[useGetList] API not available');
            return;
        }

        setLoading(true);
        setError(null);

        console.log(`[useGetList] Fetching ${endpoint}`, activeFilters);

        try {
            const response = await api.get<PaginatedResponse<TDto> | TDto[]>(endpoint, {
                params: activeFilters,
            });
            const responseData = response.data;
            let rawData: TDto[];

            if (responseData && !Array.isArray(responseData) && 'items' in responseData) {
                rawData = responseData.items;
            } else if (Array.isArray(responseData)) {
                rawData = responseData;
            } else {
                rawData = [];
            }

            const domainData = transformResponseRef.current
                ? transformResponseRef.current(rawData)
                : (rawData as unknown as TDomain[]);

            console.log(`[useGetList] Success, fetched ${domainData.length} items`);
            setData(domainData);
            onSuccessRef.current?.(domainData);
        } catch (err) {
            console.error(`[useGetList] Error fetching ${endpoint}:`, err);
            const errorMsg = getFriendlyErrorMessage(err).message || 'Błąd pobierania danych';
            setError(errorMsg);
            onErrorRef.current?.(errorMsg);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [api, endpoint, filtersKey]);

    useEffect(() => {
        if (enabled) {
            fetch();
        }
    }, [enabled, fetch]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setFilters = useCallback((newFilters: Record<string, any>) => {
        setFiltersState((prev) => {
            const updated = { ...prev, ...newFilters };
            console.log('[useGetList] Filters updated:', updated);
            return updated;
        });
    }, []);

    return {
        data,
        loading,
        error,
        refresh: fetch,
        filters: activeFilters,
        setFilters,
    };
};
