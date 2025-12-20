import { useState, useEffect, useCallback } from 'react';
import {
    mapProductStockResponseDto,
    mapStockProductListDtoToDomain,
} from '@/mappers/product.mapper';
import { StockFilters, StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';
import { API_STOCK } from '@/constants/Endpoints';
import { useAuth } from '@/context/AuthContext';
import { getMockStockProductsPaginated } from '@/utils/data-generator';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { StockProduct } from '@/types/domain';

const USE_MOCK = true;
const USE_MOCK_ERROR = false;

interface UseProductStockParams {
    search?: string;
    stockLevel?: StockLevelFilter;
    sortBy?: StockSortOption;
    page?: number;
    limit?: number;
}

export const useProductStock = (params: UseProductStockParams) => {
    const { api } = useAuth();

    const [items, setItems] = useState<StockProduct[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchStock = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (USE_MOCK) {
                if (USE_MOCK_ERROR) throw new Error('Mock error');

                const mockData = await getMockStockProductsPaginated(
                    200,
                    params.page ?? 1,
                    params.limit ?? 10,
                    params.search,
                    params.stockLevel,
                    params.sortBy
                );

                setItems(mapStockProductListDtoToDomain(mockData.data));
                setTotal(mockData.total);
            } else {
                const filters: StockFilters = {
                    search: params.search,
                    stockLevel:
                        params.stockLevel === StockLevelFilter.All ? undefined : params.stockLevel,
                    sortBy: params.sortBy,
                    sortDirection: params.sortBy?.endsWith('_asc') ? 'ASC' : 'DESC',
                    page: params.page ?? 1,
                    limit: params.limit ?? 10,
                };

                const response = await api!.get(API_STOCK, { params: filters });
                const mapped = mapProductStockResponseDto(response.data);
                setItems(mapped.items);
                setTotal(mapped.total);
            }
        } catch (err: unknown) {
            const friendlyMessage = getFriendlyErrorMessage(err);
            setError(friendlyMessage.message ?? 'Nieznany błąd');
        } finally {
            setLoading(false);
        }
    }, [api, params]);

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    return { items, total, loading, error, refetch: fetchStock };
};
