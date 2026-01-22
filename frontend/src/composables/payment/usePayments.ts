import { Payment, PaymentTableData } from '@/types/domain/payment';
import { API_PAYMENTS } from '@/constants/Endpoints';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { PaymentDto } from '@/types/dto';
import { useDelete } from '../common/useDelete';
import { mapPaymentDtoToDomain, mapPaymentToTableData } from '@/mappers/payment.mapper';
import { useGet } from '../common/useGet';
import { useMemo } from 'react';

export type CreatePaymentPayload = {
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    currency: string;
};

export type UpdatePaymentPayload = {
    status: string;
};

export const useCreatePayment = (
    onSuccess?: (payment: Payment) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreatePaymentPayload, Payment, PaymentDto>({
        endpoint: API_PAYMENTS,
        onSuccess,
        onError,
        transformResponse: mapPaymentDtoToDomain,
    });
};

export const useUpdatePayment = (
    onSuccess?: (payment: Payment) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<Payment, UpdatePaymentPayload, Payment, PaymentDto>({
        endpoint: API_PAYMENTS,
        onSuccess,
        onError,
        transformResponse: mapPaymentDtoToDomain,
    });
};

export const useDeletePayment = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_PAYMENTS,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const usePayment = (id?: string) => {
    return useGet<Payment, PaymentDto>({
        endpoint: API_PAYMENTS,
        id,
        transformResponse: mapPaymentDtoToDomain,
    });
};

export const usePaymentTableData = (
    paymentDtos: Payment[],
    page: number = 1,
    limit: number = 10
): PaymentTableData[] => {
    return useMemo(() => {
        return paymentDtos.map((dto, index) => mapPaymentToTableData(dto, index));
    }, [paymentDtos, page, limit]);
};
