import { Address } from './address';
import { Order2 } from '.';

export interface Customer {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    address: Address;
    orders: Order2[] | null;
};

export interface CustomerTableData {
    id: string;
    lp: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
};
