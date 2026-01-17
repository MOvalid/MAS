import { Address } from './address';

export interface Company {
    id: string; // UUID
    name: string;
    taxId: string;
    address: Address;
    email?: string;
    phoneNumber?: string;
}

export interface CompanyTableRow {
    id: string;
    lp: string;
    name: string;
    taxId: string;
    email: string;
    phone: string;
}
