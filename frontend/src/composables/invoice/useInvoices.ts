import {
    CreateInvoicePayload,
    InvoiceDetailsDto,
    InvoiceDto,
    UpdateInvoicePayload,
} from '@/types/dto';
import { API_INVOICES } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { Invoice, InvoiceDetails, InvoiceTableData } from '@/types/domain';
import { useDelete } from '../common/useDelete';
import { useMemo } from 'react';
import { InvoiceSort } from '@/types/common';
import {
    mapInvoiceDetailsDtoToDomain,
    mapInvoiceDtoToDomain,
    mapInvoiceToTableData,
} from '@/mappers/invoice.mapper';

export type InvoiceFilters = {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
};

export const useCreateInvoice = (
    onSuccess?: (invoiceDetails: InvoiceDetails) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateInvoicePayload, InvoiceDetails, InvoiceDetailsDto>({
        endpoint: API_INVOICES,
        onSuccess,
        onError,
        transformResponse: mapInvoiceDetailsDtoToDomain,
    });
};

export const useUpdateInvoice = (
    onSuccess?: (invoiceDetails: InvoiceDetails) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<UpdateInvoicePayload, UpdateInvoicePayload, InvoiceDetails, InvoiceDetailsDto>(
        {
            endpoint: API_INVOICES,
            onSuccess,
            onError,
            transformResponse: mapInvoiceDetailsDtoToDomain,
        }
    );
};

export const useDeleteInvoice = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_INVOICES,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const useInvoices = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<InvoiceDto, InvoiceSort>({
            endpoint: API_INVOICES,
            enabled,
            initialFilters,
        });

    const data = items.map(mapInvoiceDtoToDomain);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

export const useInvoiceTableData = (
    orderDtos: Invoice[],
    page: number = 1,
    limit: number = 10
): InvoiceTableData[] => {
    return useMemo(() => {
        return orderDtos.map((dto, index) => mapInvoiceToTableData(dto, index, page, limit));
    }, [orderDtos, page, limit]);
};
