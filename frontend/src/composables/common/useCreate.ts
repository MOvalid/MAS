import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface UseCreateOptions<TCreate, TDomain, TDto> {
    endpoint: string;
    onSuccess?: (data: TDomain) => void;
    onError?: (error: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformRequest?: (data: any) => TCreate;
    transformResponse?: (dto: TDto) => TDomain;
}

export const useCreate = <TCreate, TDomain, TDto>({
    endpoint,
    onSuccess,
    onError,
    transformRequest,
    transformResponse,
}: UseCreateOptions<TCreate, TDomain, TDto>) => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(
        async (payload: TCreate): Promise<TDomain | null> => {
            if (!api) return null;

            setLoading(true);
            setError(null);

            try {
                const requestData = transformRequest ? transformRequest(payload) : payload;
                const response = await api.post<TDto>(endpoint, requestData);

                const domainData = transformResponse
                    ? transformResponse(response.data)
                    : (response.data as unknown as TDomain);

                onSuccess?.(domainData);
                return domainData;
            } catch (err) {
                const errorMsg = getFriendlyErrorMessage(err).message || 'Błąd zapisu';
                setError(errorMsg);
                onError?.(errorMsg);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [api, endpoint, onSuccess, onError, transformResponse]
    );

    return { create, loading, error };
};
