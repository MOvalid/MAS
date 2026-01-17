import { Customer } from '@/types/domain/customer';
import { API_CUSTOMERS } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { CustomerDto } from '@/types/dto';
import { useDelete } from '../common/useDelete';
import { mapCustomerDtoToDomain, mapCustomerToDto } from '@/mappers/customer.mapper';
import { useGet } from '../common/useGet';

/**
 * Pobieranie listy klientów (zagnieżdżony adres jest częścią obiektu Customer)
 */
export const useCustomers = (enabled: boolean = true) => {
    return usePaginated<Customer>({
        endpoint: API_CUSTOMERS,
        enabled,
        initialPage: 1,
        initialLimit: 10,
    });
};

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
    return useUpdate<Customer, CustomerDto>({
        endpoint: API_CUSTOMERS,
        onSuccess,
        onError,
        transformRequest: mapCustomerToDto,
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
