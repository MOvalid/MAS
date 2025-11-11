import { Order } from './order';

export interface Seller {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string;
    orders: Order[] | null;
}
