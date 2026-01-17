import { Company } from '@/types/domain/company';
import { API_COMPANIES } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { CompanyDto } from '@/types/dto';
import { mapCompanyDtoToDomain, mapCompanyToDto } from '@/mappers/company.mapper';
import { useDelete } from '../common/useDelete';
import { useGet } from '../common/useGet';

export const useCompanies = (enabled: boolean = true) => {
    return usePaginated<Company>({
        endpoint: API_COMPANIES,
        enabled,
        initialPage: 1,
        initialLimit: 10,
    });
};

export type CreateCompanyPayload = Omit<Company, 'id'>;

export const useCreateCompany = (
    onSuccess?: (company: Company) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateCompanyPayload, Company, CompanyDto>({
        endpoint: API_COMPANIES,
        onSuccess,
        onError,
        transformResponse: mapCompanyDtoToDomain,
    });
};

/**
 * Hook do aktualizacji istniejącej firmy
 * @param onSuccess - Callback wywoływany po pomyślnej aktualizacji firmy
 * @param onError - Callback wywoływany w przypadku błędu
 */
export const useUpdateCompany = (
    onSuccess?: (company: Company) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<Company, CompanyDto>({
        endpoint: API_COMPANIES,
        onSuccess,
        onError,
        transformRequest: mapCompanyToDto,
        transformResponse: mapCompanyDtoToDomain,
    });
};

/**
 * Hook do usuwania firmy
 * @param onSuccess - Callback wywoływany po pomyślnym usunięciu
 * @param onError - Callback wywoływany w przypadku błędu
 */
export const useDeleteCompany = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_COMPANIES,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};


export const useCompany = (id?: string) => {
    return useGet<Company, CompanyDto>({
        endpoint: API_COMPANIES,
        id,
        transformResponse: mapCompanyDtoToDomain,
    });
};
