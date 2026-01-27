import { PaymentSummaryStatus, PaymentStatus } from '@/types/common';
import { OrderItem, Payment } from '@/types/domain';
import { useMemo } from 'react';

export const useOrderPaymentSummary = (items?: OrderItem[] | null, payments?: Payment[] | null) =>
    useMemo(() => {
        const orderTotal = items?.reduce((sum, item) => sum + item.totalGrossPrice, 0) ?? 0;

        const paymentsTotal =
            payments?.reduce((sum, p) => {
                if (p.status === PaymentStatus.COMPLETED) {
                    return sum + p.amount;
                }
                return sum;
            }, 0) ?? 0;

        const remainingAmount = orderTotal - paymentsTotal;

        let status: PaymentSummaryStatus = 'NONE';

        if (paymentsTotal === 0) status = 'NONE';
        else if (Math.abs(remainingAmount) < 0.01) status = 'PAID';
        else if (remainingAmount > 0) status = 'PARTIAL';
        else status = 'OVERPAID';

        return {
            orderTotal,
            paymentsTotal,
            remainingAmount: Math.max(0, remainingAmount),
            overpaidAmount: remainingAmount < 0 ? Math.abs(remainingAmount) : 0,
            status,
            isFullyPaid: status === 'PAID',
            isOverpaid: status === 'OVERPAID',
        };
    }, [items, payments]);
