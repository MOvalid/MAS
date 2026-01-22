import { Company, CompanyTableData } from '@/types/domain/company';
import { API_COMPANIES } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { CompanyDto } from '@/types/dto';
import { mapCompanyDtoToDomain, mapCompanyToTableRow } from '@/mappers/company.mapper';
import { useDelete } from '../common/useDelete';
import { useGet } from '../common/useGet';
import { useMemo } from 'react';
import { CompanySort } from '@/types/common';

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
    return useUpdate<Company, CompanyDto, Company, CompanyDto>({
        endpoint: API_COMPANIES,
        onSuccess,
        onError,
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

export const useCompanies = (enabled = true, initialFilters = {}) => {
    const { items, total, page, setPage, limit, loading, error, refetch, setFilters } =
        usePaginated<CompanyDto, CompanySort>({
            endpoint: API_COMPANIES,
            enabled,
            initialFilters,
        });

    const data = useMemo(() => items.map(mapCompanyDtoToDomain), [items]);

    return { data, total, page, setPage, limit, loading, error, refetch, setFilters };
};

export const useCompanyTableData = (
    companyDtos: Company[],
    page: number = 1,
    limit: number = 10
): CompanyTableData[] => {
    return useMemo(() => {
        return companyDtos.map((dto, index) => mapCompanyToTableRow(dto, index, page, limit));
    }, [companyDtos, page, limit]);
};
