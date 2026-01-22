// src/mappers/payment.mapper.ts
import { PaymentDto } from '@/types/dto';
import { Payment, PaymentTableData } from '@/types/domain';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/types/common';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';
import { PaymentMethod, PaymentStatus } from '@/types/common';

export const mapPaymentDtoToTableData = (payment: PaymentDto): PaymentTableData => ({
    lp: '1.',
    id: payment.id,
    method: PAYMENT_METHOD_LABELS[payment.paymentMethod as PaymentMethod] ?? payment.paymentMethod,
    amount: formatPrice(payment.amount),
    statusLabel: PAYMENT_STATUS_LABELS[payment.status as PaymentStatus] ?? payment.status,
    status: payment.status,
    paymentDate: payment.paymentDate ? formatPolishDate(payment.paymentDate, false) : '-',
    currency: payment.currency,
});

export const mapPaymentListToTableData = (
    payments: PaymentDto[] | null | undefined
): PaymentTableData[] => payments?.map(mapPaymentDtoToTableData) ?? [];

export const mapPaymentDtoToDomain = (dto: PaymentDto): Payment => {
    return {
        id: dto.id,
        orderId: dto.orderId ?? null,
        invoiceId: dto.invoiceId ?? null,
        amount: dto.amount,
        currency: 'PLN',
        paymentMethod: dto.paymentMethod,
        status: dto.status,
        paymentDate: dto.paymentDate ?? null,
    };
};

export const mapPaymentToTableData = (payment: Payment, index: number = 1): PaymentTableData => {
    return {
        lp: (index + 1).toString(),
        id: payment.id,
        method:
            PAYMENT_METHOD_LABELS[payment.paymentMethod as PaymentMethod] ?? payment.paymentMethod,
        amount: formatPrice(payment.amount),
        statusLabel: PAYMENT_STATUS_LABELS[payment.status as PaymentStatus] ?? payment.status,
        status: payment.status,
        paymentDate: payment.paymentDate ? formatPolishDate(payment.paymentDate, false) : '-',
        currency: payment.currency,
    };
};
