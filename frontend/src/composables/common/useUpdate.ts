// composables/useUpdate.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface UseUpdateOptions<TDomain, TDto> {
    endpoint: string;
    onSuccess?: (data: TDomain) => void;
    onError?: (error: string) => void;
    transformRequest?: (domain: TDomain) => TDto;
    transformResponse?: (dto: TDto) => TDomain;
}

export const useUpdate = <TDomain, TDto>({
    endpoint,
    onSuccess,
    onError,
    transformRequest,
    transformResponse,
}: UseUpdateOptions<TDomain, TDto>) => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(
        async (id: string, payload: TDomain): Promise<TDomain | null> => {
            if (!api) return null;

            setLoading(true);
            setError(null);

            try {
                const requestData = transformRequest ? transformRequest(payload) : payload;
                const response = await api.put<TDto>(`${endpoint}/${id}`, requestData);

                const domainData = transformResponse
                    ? transformResponse(response.data)
                    : (response.data as unknown as TDomain);

                onSuccess?.(domainData);
                return domainData;
            } catch (err) {
                const errorMsg = getFriendlyErrorMessage(err).message || 'Błąd aktualizacji';
                setError(errorMsg);
                onError?.(errorMsg);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [api, endpoint, onSuccess, onError, transformRequest, transformResponse]
    );

    return { update, loading, error };
};
