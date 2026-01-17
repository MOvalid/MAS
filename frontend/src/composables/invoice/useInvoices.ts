import { InvoiceDto } from '@/types/dto';
import { API_INVOICES } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';

export type InvoiceFilters = {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
};

export const useInvoices = (
    enabled: boolean = true,
    initialFilters: InvoiceFilters = {},
    initialPage: number = 1,
    initialLimit: number = 10
) => {
    return usePaginated<InvoiceDto, InvoiceFilters>({
        endpoint: API_INVOICES,
        enabled,
        initialFilters,
        initialPage,
        initialLimit,
    });
};
