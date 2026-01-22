import { useState, useCallback, useRef, useEffect } from 'react';
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

    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
    }, [onSuccess, onError]);

    const create = useCallback(
        async (payload: TCreate): Promise<TDomain | null> => {
            if (!api) return null;

            setLoading(true);
            setError(null);

            try {
                const requestData = transformRequest ? transformRequest(payload) : payload;
                const response = await api.post<TDto>(endpoint, requestData);
                console.log('[useCreate] Response received successfully!');
                if (!response) throw new Error('No response from API');
                console.log(response.data as unknown as TDomain);
                console.log(transformResponse);
                const domainData = transformResponse
                    ? transformResponse(response.data)
                    : (response.data as unknown as TDomain);
                console.log('[useCreate] Domain data retrieved successfully!');
                onSuccessRef.current?.(domainData);
                console.log('[useCreate] onSuccess()');
                return domainData;
            } catch (err) {
                const errorObj = getFriendlyErrorMessage(err);
                const errorMsg = errorObj.message || 'Błąd zapisu';

                setError(errorMsg);
                onErrorRef.current?.(errorMsg);
                console.log(errorMsg);
                console.log('[useCreate] onError()');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [api, endpoint, transformRequest, transformResponse]
    );

    return { create, loading, error };
};
