// src/mappers/payment.mapper.ts
import { PaymentDto } from '@/types/dto';
import { PaymentTableRow } from '@/types/domain';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/types/common';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';
import { PaymentMethod, PaymentStatus } from '@/types/common';

export const mapPaymentDtoToTableRow = (payment: PaymentDto): PaymentTableRow => ({
    id: payment.id,
    method: PAYMENT_METHOD_LABELS[payment.paymentMethod as PaymentMethod] ?? payment.paymentMethod,
    amount: formatPrice(payment.amount),
    status: PAYMENT_STATUS_LABELS[payment.status as PaymentStatus] ?? payment.status,
    paidAt: payment.paidAt ? formatPolishDate(payment.paidAt, false) : '-',
    currency: payment.currency,
});

export const mapPaymentListToTableRows = (
    payments: PaymentDto[] | null | undefined
): PaymentTableRow[] => payments?.map(mapPaymentDtoToTableRow) ?? [];
