import { AddressDto } from './address';

export interface DeliveryDto {
    id: string; // UUID
    orderId: string;
    deliveryDate: string | null; // ISO datetime
    address: AddressDto;
    trackingNumber: string | null;
    carrier: string | null;
}
