import { mapPaymentToTableData } from '@/mappers/payment.mapper';
import { Payment, PaymentTableData } from '@/types/domain';
import { useMemo } from 'react';

export const usePaymentTableData = (payments: Payment[]): PaymentTableData[] => {
    return useMemo(() => {
        const sortedPayments = [...(payments || [])].sort((a, b) => {
            const timeA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
            const timeB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
            return timeB - timeA;
        });

        return sortedPayments.map((payment, index) =>
            mapPaymentToTableData(payment, (index + 1).toString())
        );
    }, [payments]);
};
