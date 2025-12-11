import { AddressDto } from './address';

export interface CompanyDto {
    id: string; // UUID
    name: string;
    taxId: string;
    address: AddressDto;
    email: string | null;
    phone: string | null;
}
