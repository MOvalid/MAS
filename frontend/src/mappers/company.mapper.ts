import { CompanyDto } from '../types/dto/company';
import { Company } from '../types/domain/company';
import { CompanyTableRow } from '../types/domain';
import { mapAddressDtoToAddress, mapAddressToAddressDto } from './address.mapper';
import { mapDtoListToDomain } from './common.mapper';
import { formatNip } from '@/utils/formatters';

export const mapCompanyDtoToDomain = (dto: CompanyDto): Company => {
    return {
        id: dto.id,
        name: dto.name,
        taxId: dto.taxId,
        address: mapAddressDtoToAddress(dto.address),
        email: dto.email ?? undefined,
        phoneNumber: dto.phone ?? undefined,
    };
};

export const mapCompanyToDto = (company: Company): CompanyDto => {
    return {
        id: company.id,
        name: company.name,
        taxId: company.taxId,
        address: mapAddressToAddressDto(company.address),
        email: company.email ?? null,
        phone: company.phoneNumber ?? null,
    };
};

export const mapCompanyDtoListToDomain = (dtos: CompanyDto[]): Company[] => {
    return mapDtoListToDomain<CompanyDto, Company>(dtos, mapCompanyDtoToDomain);
};

export const mapCompanyDtoToTableRow = (dto: CompanyDto, index: number): CompanyTableRow => {
    return {
        id: dto.id,
        lp: (index + 1).toString(),
        name: dto.name,
        taxId: formatNip(dto.taxId),
        email: dto.email || '-',
        phone: dto.phone || '-',
    };
};
