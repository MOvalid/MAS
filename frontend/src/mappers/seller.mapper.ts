import { SellerDto } from '@/types/dto/seller';
import { Seller } from '@/types/domain/seller';

export const mapSellerDtoToDomain = (dto: SellerDto): Seller => ({
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    orders: null,
});
