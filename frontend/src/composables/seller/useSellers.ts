// composables/seller/useSellerOptions.ts
import { Seller } from '@/types/domain/seller';
import { SellerDto } from '@/types/dto/seller';
import { mapSellerDtoToDomain } from '@/mappers/seller.mapper';
import { API_SELLERS } from '@/constants/Endpoints';
import { useCallback } from 'react';
import { useGetList } from '../common/useGetList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSellerOptions = (enabled = true, initialFilters: Record<string, any> = {}) => {
    const transformResponse = useCallback(
        (dtos: SellerDto[]) => dtos.map(mapSellerDtoToDomain),
        []
    );

    const { data, loading, error, refresh, filters, setFilters } = useGetList<Seller, SellerDto>({
        endpoint: API_SELLERS,
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
        setFilters, // ✅ Expose setFilters for dynamic filtering
    };
};
