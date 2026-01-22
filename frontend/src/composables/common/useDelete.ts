// composables/useDelete.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFriendlyErrorMessage } from '@/utils/error-utils';

export interface UseDeleteOptions<TResponse = void, TResponseDto = TResponse> {
    endpoint: string;
    onSuccess?: (data: TResponse) => void;
    onError?: (error: string) => void;
    transformResponse?: (dto: TResponseDto) => TResponse;
}

export const useDelete = <TResponse = void, TResponseDto = TResponse>({
    endpoint,
    onSuccess,
    onError,
    transformResponse,
}: UseDeleteOptions<TResponse, TResponseDto>) => {
    const { api } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TResponse | null>(null);

    const remove = useCallback(
        async (id: string | number): Promise<TResponse | null> => {
            if (!api) {
                const errorMsg = 'API nie jest dostępne';
                setError(errorMsg);
                onError?.(errorMsg);
                return null;
            }

            setLoading(true);
            setError(null);

            const url = `${endpoint}/${id}`;
            console.log(`[useDelete] Deleting at ${url}`);

            try {
                const response = await api.delete<TResponseDto>(url);

                console.log(`[useDelete] Success:`, response.data);

                const responseData: TResponse = transformResponse
                    ? transformResponse(response.data)
                    : (response.data as unknown as TResponse);

                setData(responseData);
                onSuccess?.(responseData);

                return responseData;
            } catch (err: unknown) {
                console.error(`[useDelete] Error at ${url}:`, err);

                const friendly = getFriendlyErrorMessage(err);
                const errorMsg = friendly.message ?? 'Nie udało się usunąć rekordu';

                setError(errorMsg);
                onError?.(errorMsg);

                return null;
            } finally {
                setLoading(false);
            }
        },
        [api, endpoint, onSuccess, onError, transformResponse]
    );

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        remove,
        loading,
        error,
        data,
        reset,
    };
};
