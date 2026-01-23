import { InvoiceStatus } from '@/types/common';

export const canInvoiceBeDeleted = (status?: string | InvoiceStatus): boolean => {
    console.log("canInvoiceBeDeleted()")
    console.log(status)
    if (!status) return false;
    const s = status.toString().toLowerCase();
    console.log(s)
    const allowedStatuses = [
        InvoiceStatus.CANCELLED.toString().toLowerCase(),
        InvoiceStatus.DRAFT.toString().toLowerCase(),
    ];
    console.log(allowedStatuses)
    console.log(allowedStatuses.includes(s))
    return allowedStatuses.includes(s);
};
