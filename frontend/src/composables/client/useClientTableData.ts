import { useMemo } from 'react';
import { Customer } from '@/types/domain/customer';
import { Company } from '@/types/domain/company';
import { formatAddressInline } from '@/utils/formatters';

export type ClientRow = {
    lp: number;
    id: string;
    icon: string;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    isCompany: boolean;
};

export const useClientTableData = (
    companies: Company[],
    customers: Customer[],
    search: string,
    type: 'ALL' | 'CUSTOMER' | 'COMPANY',
    sort: 'ALPHA_ASC' | 'ALPHA_DESC'
) => {
    return useMemo(() => {
        const companyRows: ClientRow[] = companies.map((c, index) => ({
            lp: index + 1,
            id: c.id,
            icon: '🏢',
            name: c.name,
            email: c.email ?? '-',
            phone: c.phone ?? '-',
            address: c.address ? formatAddressInline(c.address) : null,
            isCompany: true,
        }));

        const customerRows: ClientRow[] = customers.map((c, index) => ({
            lp: companyRows.length + index + 1,
            id: c.id,
            icon: '👤',
            name: `${c.firstName} ${c.lastName}`,
            email: c.email ?? '-',
            phone: c.phoneNumber ?? '-',
            address: c.address ? formatAddressInline(c.address) : null,
            isCompany: false,
        }));

        let allRows = [...companyRows, ...customerRows];

        if (search) {
            const q = search.toLowerCase();
            allRows = allRows.filter(
                (row) =>
                    row.name.toLowerCase().includes(q) ||
                    row.email.toLowerCase().includes(q) ||
                    row.phone.includes(q)
            );
        }

        if (type === 'CUSTOMER') {
            allRows = allRows.filter((r) => !r.isCompany);
        } else if (type === 'COMPANY') {
            allRows = allRows.filter((r) => r.isCompany);
        }

        if (sort === 'ALPHA_ASC') {
            allRows = [...allRows].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'ALPHA_DESC') {
            allRows = [...allRows].sort((a, b) => b.name.localeCompare(a.name));
        }

        return allRows;
    }, [companies, customers, search, type, sort]);
};
