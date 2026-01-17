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
        if (!api) {
            console.warn('[useClients] API not available yet');
            return;
        }

        setLoading(true);
        setError(null);

        console.log('[useClients] Fetching clients...');

        try {
            const [companiesRes, customersRes] = await Promise.all([
                api.get<Company[]>(API_COMPANIES),
                api.get<Customer[]>(API_CUSTOMERS),
            ]);

            const companies = companiesRes.data ?? [];
            const customers = customersRes.data ?? [];
            const clients = [...companies, ...customers];

            console.log(
                `[useClients] Fetched ${companies.length} companies, ${customers.length} customers (total: ${clients.length})`
            );

            setAllClients(clients);
        } catch (err: unknown) {
            console.error('[useClients] Error fetching clients:', err);
            const friendly = getFriendlyErrorMessage(err);
            setError(friendly.message ?? 'Nieznany błąd podczas pobierania klientów');
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

        // Apply search filter
        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter((c) => {
                // Company search
                if ('name' in c) {
                    return (
                        c.name.toLowerCase().includes(q) ||
                        c.email?.toLowerCase().includes(q) ||
                        c.nip?.toLowerCase().includes(q)
                    );
                }
                // Customer search
                return (
                    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
                    c.email?.toLowerCase().includes(q) ||
                    c.phone?.toLowerCase().includes(q)
                );
            });
        }

        // Apply type filter
        if (filters.type === 'CUSTOMER') {
            filtered = filtered.filter((c) => !('name' in c)); // Customer
        } else if (filters.type === 'COMPANY') {
            filtered = filtered.filter((c) => 'name' in c); // Company
        }

        // Apply pagination
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        console.log(
            `[useClients] Filtered: ${filtered.length}, Paginated: ${paginated.length} (page ${page}/${Math.ceil(filtered.length / limit)})`
        );

        return paginated;
    }, [allClients, filters, page, limit]);

    // Memoized total count (after filtering)
    const total = useMemo(() => {
        let filtered = [...allClients];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter((c) => {
                if ('name' in c) {
                    return (
                        c.name.toLowerCase().includes(q) ||
                        c.email?.toLowerCase().includes(q) ||
                        c.nip?.toLowerCase().includes(q)
                    );
                }
                return (
                    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
                    c.email?.toLowerCase().includes(q) ||
                    c.phone?.toLowerCase().includes(q)
                );
            });
        }

        if (filters.type === 'CUSTOMER') {
            filtered = filtered.filter((c) => !('name' in c));
        } else if (filters.type === 'COMPANY') {
            filtered = filtered.filter((c) => 'name' in c);
        }

        return filtered.length;
    }, [allClients, filters]);

    const totalPages = Math.ceil(total / limit);

    const onPrevious = useCallback(() => {
        setPage((p) => Math.max(1, p - 1));
    }, []);

    const onNext = useCallback(() => {
        setPage((p) => Math.min(totalPages, p + 1));
    }, [totalPages]);

    const onFirstPage = useCallback(() => {
        setPage(1);
    }, []);

    const onLastPage = useCallback(() => {
        setPage(totalPages);
    }, [totalPages]);

    return {
        clients,
        total,
        totalPages,
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
        onFirstPage,
        onLastPage,
        setAllClients,
    };
};
