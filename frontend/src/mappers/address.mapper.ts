import { AddressDto } from '../types/dto/address';
import { Address } from '../types/domain/address';

export const mapAddressDtoToAddress = (dto: AddressDto): Address => {
    return {
        street: dto.street,
        number: dto.number,
        city: dto.city,
        postalCode: dto.postalCode,
        country: dto.country,
    };
};
