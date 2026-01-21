import { API_CARRIERS } from '@/constants/Endpoints';
import { useCallback } from 'react';
import { useGetList } from '../common/useGetList';
import { mapCarrierDtoToDomain } from '@/mappers/carrier.mapper';
import { Carrier } from '@/types/domain/carrier';
import { CarrierDto } from '@/types/dto/carrier';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCarrierOptions = (enabled = true, initialFilters: Record<string, any> = {}) => {
    const transformResponse = useCallback(
        (dtos: CarrierDto[]) => dtos.map(mapCarrierDtoToDomain),
        []
    );

    const { data, loading, error, refresh, filters, setFilters } = useGetList<Carrier, CarrierDto>({
        endpoint: API_CARRIERS,
        enabled,
        initialFilters,
        transformResponse,
    });

    return {
        data,
        loading,
        error,
        refetch: refresh,
        filters,
        setFilters,
    };
};
