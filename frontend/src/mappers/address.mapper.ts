import { AddressDto } from '../types/dto/address';
import { Address } from '../types/domain/address';

export const mapAddressDtoToDomain = (dto: AddressDto): Address => {
    return {
        street: dto.street,
        houseNumber: dto.number,
        city: dto.city,
        postalCode: dto.postalCode,
        country: dto.country,
    };
};

export const mapAddressToDto = (address: Address): AddressDto => {
    return {
        street: address.street,
        number: address.houseNumber,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
    };
};
