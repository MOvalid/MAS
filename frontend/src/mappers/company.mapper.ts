import { CompanyDto } from '../types/dto/company';
import { Company } from '../types/domain/company';
import { CompanyTableData } from '../types/domain';
import { mapAddressDtoToDomain, mapAddressToDto } from './address.mapper';
import { mapDtoListToDomain } from './common.mapper';
import { formatNip } from '@/utils/formatters';

export const mapCompanyDtoToDomain = (dto: CompanyDto): Company => {
    return {
        id: dto.id,
        name: dto.name,
        taxId: dto.taxId,
        address: mapAddressDtoToDomain(dto.address),
        email: dto.email ?? undefined,
        phoneNumber: dto.phone ?? undefined,
    };
};

export const mapCompanyToDto = (company: Company): CompanyDto => {
    return {
        id: company.id,
        name: company.name,
        taxId: company.taxId,
        address: mapAddressToDto(company.address),
        email: company.email ?? null,
        phone: company.phoneNumber ?? null,
    };
};

export const mapCompanyDtoListToDomain = (dtos: CompanyDto[]): Company[] => {
    return mapDtoListToDomain<CompanyDto, Company>(dtos, mapCompanyDtoToDomain);
};

export const mapCompanyToTableRow = (
    company: Company, 
    index: number, 
    page: number = 1, 
    limit: number = 10
): CompanyTableData => {
    const rowNumber = (page - 1) * limit + index + 1;
    const { city, street, houseNumber } = company.address;
    const formattedAddress = `${city}, ${street} ${houseNumber}`;

    return {
        id: company.id,
        lp: rowNumber.toString(),
        name: company.name,
        taxId: formatNip(company.taxId),
        email: company.email || '-',
        phone: company.phoneNumber || '-',
        address: formattedAddress,
    };
};
