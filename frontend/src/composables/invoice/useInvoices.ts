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
import { useMemo, useState } from 'react';
import { InvoiceSort } from '@/types/common';
import {
    mapInvoiceDetailsDtoToDomain,
    mapInvoiceDtoToDomain,
    mapInvoiceToTableData,
} from '@/mappers/invoice.mapper';
import { useAuth } from '@/context/AuthContext';
import { TIMEOUT } from '@/config';

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

export const useGenerateInvoicePdf = (
    onSuccess?: () => void,
    onError?: (error: string) => void
) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { getAccessToken, api } = useAuth();

    const generatePdf = async (invoiceId: string, invoiceNumber: string) => {
        setIsGenerating(true);
        try {
            const token = getAccessToken ? await getAccessToken() : null;

            if (!token) {
                throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
            }

            const baseUrl = api?.defaults.baseURL || process.env.EXPO_PUBLIC_API_URL;
            const fullUrl = `${baseUrl}${API_INVOICES}/${invoiceId}/file`;
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error('Serwer odrzucił żądanie pobrania faktury.');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;

            const safeFileName = invoiceNumber.replace(/[/\\?%*:|"<>]/g, '_');
            link.setAttribute('download', `${safeFileName}.pdf`);
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => window.URL.revokeObjectURL(blobUrl), TIMEOUT);

            onSuccess?.();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            onError?.(err.message || 'Nie udało się wygenerować PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return { generatePdf, isGenerating };
};
