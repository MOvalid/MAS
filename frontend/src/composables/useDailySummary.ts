import { DailySummaryDto, DailySummaryViewData } from '@/types/dto/dashboard';
import { useGet } from './common/useGet';
import { API_STATISTICS } from '@/constants/Endpoints';
import { mapDailySummaryDtoToViewData } from '@/mappers/dashboard.mapper';

export const useDailySummary = (date?: string) => {
    // const effectiveDate = date ?? getLocalDateString();
    const effectiveDate = date ?? new Date().toISOString().split('T')[0];

    console.log(effectiveDate);
    return useGet<DailySummaryViewData[], DailySummaryDto>({
        // requiresId: false,
        id: `daySummary?date=${effectiveDate}`,
        endpoint: API_STATISTICS,
        transformResponse: mapDailySummaryDtoToViewData,
    });
};
