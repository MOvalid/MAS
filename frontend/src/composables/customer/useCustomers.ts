import { Customer } from '@/types/domain/customer';
import { API_CUSTOMERS } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';

export const useCustomers = (enabled: boolean = true) => {
    return usePaginated<Customer>({
        endpoint: API_CUSTOMERS,
        enabled,
        initialPage: 1,
        initialLimit: 10,
    });
};
