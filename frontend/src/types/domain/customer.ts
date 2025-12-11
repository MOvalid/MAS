import { Address } from './address';
import { Order } from '.';

export interface Customer {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    address: Address | null;
    orders: Order[] | null;
}
