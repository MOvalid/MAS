import { Customer, CustomerTableData } from '@/types/domain/customer';
import { API_CUSTOMERS } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { CustomerDto } from '@/types/dto';
import { useDelete } from '../common/useDelete';
import { mapCustomerDtoToDomain, mapCustomerToTableRow } from '@/mappers/customer.mapper';
import { useGet } from '../common/useGet';
import { useCallback, useMemo } from 'react';
import { CustomerSort } from '@/types/common';
import { useGetList } from '../common/useGetList';

export type CreateCustomerPayload = Omit<Customer, 'id' | 'orders'>;

export const useCreateCustomer = (
    onSuccess?: (customer: Customer) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateCustomerPayload, Customer, CustomerDto>({
        endpoint: API_CUSTOMERS,
        onSuccess,
        onError,
        transformResponse: mapCustomerDtoToDomain,
    });
};

export const useUpdateCustomer = (
    onSuccess?: (customer: Customer) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<Customer, CustomerDto, Customer, CustomerDto>({
        endpoint: API_CUSTOMERS,
        onSuccess,
        onError,
        transformResponse: mapCustomerDtoToDomain,
    });
};

export const useDeleteCustomer = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_CUSTOMERS,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const useCustomer = (id?: string) => {
    return useGet<Customer, CustomerDto>({
        endpoint: API_CUSTOMERS,
        id,
        transformResponse: mapCustomerDtoToDomain,
    });
};

export const useCustomers = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<CustomerDto, CustomerSort>({
            endpoint: API_CUSTOMERS,
            enabled,
            initialFilters,
        });

    const data = items.map(mapCustomerDtoToDomain);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCustomerOptions = (enabled = true, initialFilters: Record<string, any> = {}) => {
    const transformResponse = useCallback(
        (dtos: CustomerDto[]) => dtos.map(mapCustomerDtoToDomain),
        []
    );

    const { data, loading, error, refresh, filters, setFilters } = useGetList<
        Customer,
        CustomerDto
    >({
        endpoint: API_CUSTOMERS,
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

export const useCustomerTableData = (
    customerDtos: Customer[],
    page: number = 1,
    limit: number = 10
): CustomerTableData[] => {
    return useMemo(() => {
        return customerDtos.map((dto, index) => mapCustomerToTableRow(dto, index, page, limit));
    }, [customerDtos, page, limit]);
};
