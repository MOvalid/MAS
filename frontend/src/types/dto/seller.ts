import { OrderDto } from '.';

export interface SellerDto {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string;
    orders: OrderDto[] | null;
}
