import { AddressDto } from './address';

export interface DeliveryDto {
    id: string; // UUID
    orderId: string;
    carrierId: string | null;
    deliveryDate: string | null; // ISO datetime
    address: AddressDto;
    trackingNumber: string | null;

}
