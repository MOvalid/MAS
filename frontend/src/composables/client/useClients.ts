import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Customer } from '@/types/domain/customer';
import { Company } from '@/types/domain/company';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { API_COMPANIES, API_CUSTOMERS } from '@/constants/Endpoints';

export type ClientRowData = Customer | Company;

export type ClientFilters = {
    search?: string;
    type?: 'ALL' | 'CUSTOMER' | 'COMPANY';
};

export const useClients = (
    enabled: boolean = true,
    initialFilters: ClientFilters = {},
    initialPage: number = 1,
    initialLimit: number = 10
) => {
    const { api } = useAuth();

    const [allClients, setAllClients] = useState<ClientRowData[]>([]);
    const [filters, setFilters] = useState<ClientFilters>(initialFilters);
    const [page, setPage] = useState<number>(initialPage);
    const [limit, setLimit] = useState<number>(initialLimit);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        if (!api) return;

        setLoading(true);
        setError(null);

        try {
            const [companiesRes, customersRes] = await Promise.all([
                api.get<Company[]>(API_COMPANIES),
                api.get<Customer[]>(API_CUSTOMERS),
            ]);

            const clients = [...(companiesRes.data ?? []), ...(customersRes.data ?? [])];
            console.log(`[useClients] Fetched ${clients.length} clients`);

            setAllClients(clients);
        } catch (err: unknown) {
            console.error('[useClients] Error fetching clients:', err);
            const friendly = getFriendlyErrorMessage(err);
            setError(friendly.message ?? 'Nieznany błąd');
            setAllClients([]);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (enabled) {
            fetchClients();
        }
    }, [fetchClients, enabled]);

    // Memoized filtered and paginated clients
    const clients = useMemo(() => {
        let filtered = [...allClients];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    ('name' in c && c.name.toLowerCase().includes(q)) ||
                    ('firstName' in c && `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)) ||
                    (c.email?.toLowerCase().includes(q) ?? false)
            );
        }

        if (filters.type === 'CUSTOMER') {
            filtered = filtered.filter((c) => !('name' in c)); // Customer
        } else if (filters.type === 'COMPANY') {
            filtered = filtered.filter((c) => 'name' in c); // Company
        }

        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return paginated;
    }, [allClients, filters, page, limit]);

    const total = useMemo(() => {
        let filtered = [...allClients];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    ('name' in c && c.name.toLowerCase().includes(q)) ||
                    ('firstName' in c && `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)) ||
                    (c.email?.toLowerCase().includes(q) ?? false)
            );
        }

        if (filters.type === 'CUSTOMER') {
            filtered = filtered.filter((c) => !('name' in c));
        } else if (filters.type === 'COMPANY') {
            filtered = filtered.filter((c) => 'name' in c);
        }

        return filtered.length;
    }, [allClients, filters]);

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    return {
        clients,
        total,
        page,
        setPage,
        limit,
        setLimit,
        filters,
        setFilters,
        loading,
        error,
        refetch: fetchClients,
        onPrevious,
        onNext,
        setAllClients,
    };
};
