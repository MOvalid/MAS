import { DailySummaryDto, DailySummaryViewData } from '@/types/dto/dashboard';
import { useGet } from './common/useGet';
import { API_DAILY_SUMMARY } from '@/constants/Endpoints';
import { mapDailySummaryDtoToViewData } from '@/mappers/dashboard.mapper';

export const useDailySummary = (date?: string) => {
    const effectiveDate = date ?? new Date().toISOString().split('T')[0];
    console.log(effectiveDate)
    return useGet<DailySummaryViewData[], DailySummaryDto>({
        endpoint: `${API_DAILY_SUMMARY}?date=${effectiveDate}`,
        transformResponse: mapDailySummaryDtoToViewData,
    });
};
