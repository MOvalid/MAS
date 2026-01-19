import { API_ORDERS } from '@/constants/Endpoints';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { useDelete } from '../common/useDelete';
import { useGet } from '../common/useGet';
import { useMemo } from 'react';
import { usePaginated } from '../pagination/usePagination';
import {
    CreateOrderPayload,
    OrderDto1,
    OrderDto2,
    OrderSummaryDto,
    UpdateOrderPayload,
} from '@/types/dto';
import { Order2, OrderSummary, OrderTableData } from '@/types/domain';
import {
    mapOrder2ToTableData,
    mapOrderDto1ToDomain,
    mapOrderDto2ToDomain,
    mapOrderSummaryDtoToDomain,
} from '@/mappers/order.mapper';
import { OrderSort } from '@/types/common';

export const useCreateOrder = (
    onSuccess?: (orderDetails: OrderSummary) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateOrderPayload, OrderSummary, OrderSummaryDto>({
        endpoint: API_ORDERS,
        onSuccess,
        onError,
        transformResponse: mapOrderSummaryDtoToDomain,
    });
};

export const useUpdateOrder = (
    onSuccess?: (orderDetails: OrderSummary) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<UpdateOrderPayload, UpdateOrderPayload, OrderSummary, OrderSummaryDto>({
        endpoint: API_ORDERS,
        onSuccess,
        onError,
        transformResponse: mapOrderSummaryDtoToDomain,
    });
};

export const useDeleteOrder = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_ORDERS,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const useOrder = (id?: string) => {
    return useGet<OrderSummary, OrderSummaryDto>({
        endpoint: API_ORDERS,
        id,
        transformResponse: mapOrderSummaryDtoToDomain,
    });
};

export const useOrders1 = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<OrderDto1, OrderSort>({
            endpoint: API_ORDERS,
            enabled,
            initialFilters,
        });

    const data = items.map(mapOrderDto1ToDomain);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

export const useOrders2 = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<OrderDto2, OrderSort>({
            endpoint: API_ORDERS,
            enabled,
            initialFilters,
        });

    const data = items.map(mapOrderDto2ToDomain);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

export const useOrderTableData = (
    orders: Order2[],
    page: number = 1,
    limit: number = 10
): OrderTableData[] => {
    return useMemo(() => {
        return orders.map((order, index) => mapOrder2ToTableData(order, index, page, limit));
    }, [orders, page, limit]);
};
