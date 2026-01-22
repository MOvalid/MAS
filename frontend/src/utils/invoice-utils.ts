import { InvoiceStatus } from '@/types/common';

export const canInvoiceBeDeleted = (status?: string | InvoiceStatus): boolean => {
    if (!status) return false;
    const s = status.toString().toLowerCase();
    const allowedStatuses = [
        InvoiceStatus.CANCELLED.toString().toLowerCase(),
        InvoiceStatus.DRAFT.toString().toLowerCase(),
    ];
    return allowedStatuses.includes(s);
};
