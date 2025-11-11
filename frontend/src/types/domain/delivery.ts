import { Address } from './address';

export interface Delivery {
    id: string; // UUID
    orderId: string;
    deliveryDate: string | null; // ISO datetime
    address: Address;
    trackingNumber: string | null;
    carrier: string | null;
}
