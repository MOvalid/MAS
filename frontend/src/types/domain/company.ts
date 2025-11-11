import { Address } from './address';

export interface Company {
    id: string; // UUID
    name: string;
    taxId: string;
    address: Address;
    email: string | null;
    phone: string | null;
}
