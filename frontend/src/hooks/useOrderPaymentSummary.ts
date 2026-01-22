import { PaymentSummaryStatus } from '@/types/common';
import { OrderItem, Payment } from '@/types/domain';
import { useMemo } from 'react';


export const useOrderPaymentSummary = (items?: OrderItem[] | null, payments?: Payment[] | null) =>
    useMemo(() => {
        const orderTotal = items?.reduce((sum, item) => sum + item.totalGrossPrice, 0) ?? 0;
        const paymentsTotal = payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
        const remainingAmount = orderTotal - paymentsTotal;

        let status: PaymentSummaryStatus = 'NONE';
        if (paymentsTotal === 0) status = 'NONE';
        else if (remainingAmount === 0) status = 'PAID';
        else if (remainingAmount > 0) status = 'PARTIAL';
        else status = 'OVERPAID';

        return {
            orderTotal,
            paymentsTotal,
            remainingAmount,
            status,
            isFullyPaid: status === 'PAID',
            isOverpaid: status === 'OVERPAID',
        };
    }, [items, payments]);
