import { CustomerDto } from '../types/dto/customer';
import { Customer, CustomerTableData } from '../types/domain/customer';
import { mapAddressDtoToDomain, mapAddressToDto } from './address.mapper';
import { mapDtoListToDomain } from './common.mapper';

export const mapCustomerDtoToDomain = (dto: CustomerDto): Customer => {
    return {
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email ?? undefined,
        phoneNumber: dto.phoneNumber ?? undefined,
        address: mapAddressDtoToDomain(dto.address),
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
        address: mapAddressToDto(customer.address),
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

export const mapCustomerToTableRow = (
    customer: Customer, 
    index: number, 
    page: number = 1, 
    limit: number = 10
): CustomerTableData => {
    const rowNumber = (page - 1) * limit + index + 1;
    const { city, street, houseNumber: number } = customer.address;
    const formattedAddress = `${city}, ${street} ${number}`;

    return {
        id: customer.id,
        lp: rowNumber.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email || '-',
        phone: customer.phoneNumber || '-',
        address: formattedAddress,
    };
};
