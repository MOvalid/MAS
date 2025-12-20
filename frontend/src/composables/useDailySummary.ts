import { useEffect, useState } from 'react';
import { DailySummaryDto } from '@/types/dto/dashboard';
import { getMockDailySummary } from '@/utils/data-generator';
// import { fetchDailySummary } from '@/api/dashboard.api';

const USE_MOCK = true;
const USE_MOCK_ERROR = false;

export const useDailySummary = () => {
    const [data, setData] = useState<DailySummaryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            if (USE_MOCK_ERROR) {
                throw new Error('Symulowany błąd serwera');
            }

            const result = USE_MOCK ? await getMockDailySummary() : [];
            setData(result);
        } catch {
            setError('Nie udało się pobrać podsumowania dnia');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { data, loading, error, refresh: load };
};
