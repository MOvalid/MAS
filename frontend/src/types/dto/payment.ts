export interface PaymentDto {
    id: string; // UUID
    orderId: string | null; // UUID
    invoiceId: string | null; // UUID
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    paymentDate: string | null; // ISO datetime
}
