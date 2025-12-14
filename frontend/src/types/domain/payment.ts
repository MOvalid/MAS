export interface Payment {
    id: string; // UUID
    orderId: string | null;
    invoiceId: string | null;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    paidAt: string | null; // ISO datetime
}

export interface PaymentTableRow {
    id: string;
    method: string;
    amount: string;
    currency: string;
    status: string;
    paidAt: string;
}
