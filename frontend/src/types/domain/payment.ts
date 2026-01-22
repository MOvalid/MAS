export interface Payment {
    id: string; // UUID
    orderId: string | null;
    invoiceId: string | null;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    paymentDate: string | null; // ISO datetime
}

export interface PaymentTableData {
    lp: string;
    id: string;
    method: string;
    amount: string;
    currency: string;
    statusLabel: string;
    status: string;
    paymentDate: string;
}
