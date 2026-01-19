import { Address } from './address';

export interface Delivery {
    id: string; // UUID
    orderId: string;
    carrierId: string | null;
    deliveryDate: string | null; // ISO datetime
    address: Address;
    trackingNumber: string | null;
}
