import { AddressDto, OrderDto } from '.';

export interface CustomerDto {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
    address: AddressDto;
    orders: OrderDto[] | null;
}
