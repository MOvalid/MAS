import { CompanyDto } from '../types/dto/company';
import { Company } from '../types/domain/company';
import { CompanyTableRow } from '../types/domain';
import { mapAddressDtoToAddress } from './address.mapper';

export const mapCompanyDtoToCompany = (dto: CompanyDto): Company => {
    return {
        id: dto.id,
        name: dto.name,
        taxId: dto.taxId,
        address: mapAddressDtoToAddress(dto.address),
        email: dto.email ?? null,
        phone: dto.phone ?? null,
    };
};

const formatPolishNIP = (taxId: string): string => {
    // Usuń wszystkie znaki niebędące cyframi
    const digits = taxId.replace(/\D/g, '');

    // Sprawdź czy to polski NIP (10 cyfr)
    if (digits.length === 10) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }

    // Jeśli nie jest polskim NIP, zwróć oryginalną wartość
    return taxId;
};

export const mapCompanyDtoToTableRow = (dto: CompanyDto, index: number): CompanyTableRow => {
    return {
        id: dto.id,
        lp: (index + 1).toString(),
        name: dto.name,
        taxId: formatPolishNIP(dto.taxId),
        email: dto.email || '-',
        phone: dto.phone || '-',
    };
};
