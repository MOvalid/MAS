// composables/useUpdate.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface UseUpdateOptions<TData, TRequest, TResponse, TResponseDto> {
    endpoint: string;
    onSuccess?: (data: TResponse) => void;
    onError?: (error: string) => void;
    transformRequest?: (data: TRequest) => TRequest;
    transformResponse?: (dto: TResponseDto) => TResponse;
}

export const useUpdate = <TData, TRequest, TResponse, TResponseDto>({
    endpoint,
    onSuccess,
    onError,
    transformRequest,
    transformResponse,
}: UseUpdateOptions<TData, TRequest, TResponse, TResponseDto>) => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(
        async (id: string, payload: TRequest): Promise<TResponse | null> => {
            if (!api) return null;

            setLoading(true);
            setError(null);

            try {
                const requestData = transformRequest ? transformRequest(payload) : payload;
                const response = await api.put<TResponseDto>(`${endpoint}/${id}`, requestData);

                const domainData = transformResponse
                    ? transformResponse(response.data)
                    : (response.data as unknown as TResponse);

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
