import { useState, useEffect, useCallback } from 'react';
import { ProductStock } from '@/types/domain/product';
import { mapProductStockResponseDto } from '@/mappers/product.mapper';
import { ApiError } from '@/types/common/error';
import { StockFilters, StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';
import { API_STOCK } from '@/constants/Endpoints';
import { useAuth } from '@/context/AuthContext';
import { handleApiError } from '@/utils/error-handler';

interface UseProductStockParams {
    search?: string;
    stockLevel?: StockLevelFilter;
    sortBy?: StockSortOption;
    page?: number;
    limit?: number;
}

export const useProductStock = (params: UseProductStockParams) => {
    const { api } = useAuth();

    const [items, setItems] = useState<ProductStock[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<ApiError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchStock = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const filters: StockFilters = {
                search: params.search,
                stockLevel:
                    params.stockLevel === StockLevelFilter.All ? undefined : params.stockLevel,
                sortBy: params.sortBy,
                sortDirection: params.sortBy?.endsWith('_asc') ? 'ASC' : 'DESC',
                page: params.page ?? 1,
                limit: params.limit ?? 20,
            };

            const response = await api!.get(API_STOCK, { params: filters });
            const mapped = mapProductStockResponseDto(response.data);
            setItems(mapped.items);
            setTotal(mapped.total);
        } catch (err: unknown) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [api, params]);

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    return {
        items,
        total,
        loading,
        error,
        refetch: fetchStock,
    };
};
