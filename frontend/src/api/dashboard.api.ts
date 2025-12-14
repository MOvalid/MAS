// api/dashboard.api.ts
import { DailySummaryDto } from '@/types/dto/dashboard';
import { apiClient } from '@/api/apiClient';

export const fetchDailySummary = async (): Promise<DailySummaryDto[]> => {
    const { data } = await apiClient.get('/dashboard/daily-summary');

    return data;
};
