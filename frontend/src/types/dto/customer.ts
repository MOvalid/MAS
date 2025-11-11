import { AddressDto, OrderDto } from '.';

export interface CustomerDto {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    address?: AddressDto | null;
    orders?: OrderDto[] | null;
}
