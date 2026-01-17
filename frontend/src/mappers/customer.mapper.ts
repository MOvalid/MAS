import { CustomerDto } from '../types/dto/customer';
import { Customer } from '../types/domain/customer';
import { mapAddressDtoToAddress, mapAddressToAddressDto } from './address.mapper';
import { mapDtoListToDomain } from './common.mapper';

export const mapCustomerDtoToDomain = (dto: CustomerDto): Customer => {
    return {
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email ?? undefined,
        phoneNumber: dto.phoneNumber ?? undefined,
        address: mapAddressDtoToAddress(dto.address),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        orders: dto.orders ? (dto.orders as any) : [],
    };
};

/**
 * Mapuje model domenowy klienta na DTO (do wysyłki do API)
 */
export const mapCustomerToDto = (customer: Customer): CustomerDto => {
    return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email ?? null,
        phoneNumber: customer.phoneNumber ?? null,
        address: mapAddressToAddressDto(customer.address),
        orders: null,
    };
};

/**
 * Mapuje listę DTO na listę modeli domenowych
 */
export const mapCustomerDtoListToDomain = (dtos: CustomerDto[]): Customer[] => {
    return mapDtoListToDomain<CustomerDto, Customer>(dtos, mapCustomerDtoToDomain);
};

/**
 * Formatuje imię i nazwisko do wyświetlenia w tabeli
 */
const formatFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
};

/**
 * Mapuje DTO na wiersz tabeli (uproszczony widok listy)
 */
export const mapCustomerDtoToTableRow = (dto: CustomerDto, index: number) => {
    return {
        id: dto.id,
        lp: (index + 1).toString(),
        fullName: formatFullName(dto.firstName, dto.lastName),
        email: dto.email,
        phone: dto.phoneNumber || '-',
        city: dto.address?.city || '-',
    };
};
