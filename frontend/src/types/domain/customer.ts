import { Address } from './address';
import { Order } from '.';

export interface Customer {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    address: Address;
    orders: Order[] | null;
}
