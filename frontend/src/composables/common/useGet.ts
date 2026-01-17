import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface UseGetOptions<TDomain, TDto> {
    endpoint: string;
    id?: string;
    enabled?: boolean;
    transformResponse?: (dto: TDto) => TDomain;
    onSuccess?: (data: TDomain) => void;
    onError?: (error: string) => void;
}

export const useGet = <TDomain, TDto = TDomain>({
    endpoint,
    id,
    enabled = true,
    transformResponse,
    onSuccess,
    onError,
}: UseGetOptions<TDomain, TDto>) => {
    const { api } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TDomain | null>(null);

    const fetch = useCallback(async () => {
        if (!api || !id) return;

        setLoading(true);
        setError(null);

        try {
            const url = `${endpoint}/${id}`;
            const response = await api.get<TDto>(url);

            const domainData = transformResponse 
                ? transformResponse(response.data) 
                : (response.data as unknown as TDomain);

            setData(domainData);
            onSuccess?.(domainData);
        } catch (err) {
            const errorMsg = getFriendlyErrorMessage(err).message || 'Błąd pobierania danych';
            setError(errorMsg);
            onError?.(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [api, endpoint, id, transformResponse, onSuccess, onError]);

    useEffect(() => {
        if (enabled && id) {
            fetch();
        }
    }, [id, enabled, fetch]);

    return { data, loading, error, refresh: fetch };
};
