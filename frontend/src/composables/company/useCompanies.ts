import { Company } from '@/types/domain/company';
import { API_COMPANIES } from '@/constants/Endpoints';
import { usePaginated } from '../pagination/usePagination';

export const useCompanies = (enabled: boolean = true) => {
    return usePaginated<Company>({
        endpoint: API_COMPANIES,
        enabled,
        initialPage: 1,
        initialLimit: 10,
    });
};
