import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../common/AppButton';
import { AppText } from '../../common/AppText';
import { AppTable } from '../../common/table/AppTable';
import { metrics } from '../../../theme/metrics';
import { IconName } from '../../common';
import { Customer } from '../../../types/domain/customer';
import { Company } from '../../../types/domain/company';
import { ClientListFilters } from './ClientListFilters';
import { ClientTypeFilter, ClientSort } from '@/types/common';
import { ClientRow } from '@/types/view-model/client';

// Mock data
const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'ACME Sp. z o.o.',
        taxId: '9876543210',
        address: {
            street: 'Nowa',
            number: '5',
            city: 'Kraków',
            postalCode: '31-000',
            country: 'Polska',
        },
        email: 'kontakt@acme.pl',
        phone: '123456789',
    },
    {
        id: '2',
        name: 'Tech Solutions S.A.',
        taxId: '1234567890',
        address: {
            street: 'Warszawska',
            number: '15',
            city: 'Warszawa',
            postalCode: '00-001',
            country: 'Polska',
        },
        email: 'biuro@techsolutions.pl',
        phone: '987654321',
    },
];

const mockCustomers: Customer[] = [
    {
        id: 'c1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48 111 222 333',
        address: {
            street: 'Lipowa',
            number: '12',
            city: 'Gdańsk',
            postalCode: '80-001',
            country: 'Polska',
        },
        orders: [],
    },
    {
        id: 'c2',
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@example.com',
        phoneNumber: null,
        address: null,
        orders: [],
    },
];

export const ClientListScreen = () => {
    const navigation = useNavigation();

    // FILTRY
    const [search, setSearch] = useState('');
    const [type, setType] = useState<ClientTypeFilter>('ALL');
    const [sort, setSort] = useState<ClientSort>('ALPHA_ASC');

    const tableData: ClientRow[] = useMemo(() => {
        const companyRows: ClientRow[] = mockCompanies.map((c) => ({
            id: c.id,
            icon: `🏢`,
            name: c.name,
            email: c.email || '-',
            phone: c.phone || '-',
            address: c.address
                ? `${c.address.street} ${c.address.number}, ${c.address.city}`
                : null,
            isCompany: true,
        }));

        const customerRows: ClientRow[] = mockCustomers.map((c) => ({
            id: c.id,
            icon: `👤`,
            name: `${c.firstName} ${c.lastName}`,
            email: c.email,
            phone: c.phoneNumber,
            address: c.address
                ? `${c.address.street} ${c.address.number}, ${c.address.city}`
                : null,
            isCompany: false,
        }));

        let allRows = [...companyRows, ...customerRows];

        if (search) {
            const q = search.toLowerCase();
            allRows = allRows.filter(
                (row) =>
                    row.name.toLowerCase().includes(q) ||
                    (row.email?.toLowerCase().includes(q) ?? false) ||
                    (row.phone?.includes(search) ?? false)
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
    }, [search, type, sort]);

    const handleEdit = (row: ClientRow) => {
        if (row.isCompany) {
            navigation.navigate('CompanyAddEditScreen', { id: row.id });
        } else {
            navigation.navigate('CustomerAddEditScreen', { id: row.id });
        }
    };

    const handleAddCompany = () => navigation.navigate('Company', { screen: 'CompanyAdd' });
    const handleAddCustomer = () => navigation.navigate('Customer', { screen: 'CustomerAdd' });

    const handleDelete = (row: ClientRow) => console.log('Delete:', row);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge" style={styles.pageTitle}>
                    Klienci i firmy
                </AppText>

                <View style={{ flexDirection: 'row', gap: metrics.spacing.md }}>
                    <AppButton onPress={handleAddCompany}>Nowa firma</AppButton>
                    <AppButton onPress={handleAddCustomer}>Nowy klient</AppButton>
                </View>
            </View>

            <ClientListFilters
                search={search}
                onSearchChange={setSearch}
                clientType={type}
                onClientTypeChange={setType}
                sortBy={sort}
                onSortByChange={setSort}
            />

            <AppTable
                columns={[
                    { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
                    { key: 'icon', title: '', align: 'left', flex: 0.2 },
                    { key: 'name', title: 'Nazwa / Imię i nazwisko', align: 'left', flex: 1.5 },
                    { key: 'email', title: 'Email', align: 'left', flex: 1.8 },
                    { key: 'phone', title: 'Telefon', align: 'left', flex: 1 },
                    { key: 'address', title: 'Adres', align: 'left', flex: 2 },
                ]}
                data={tableData.map((row, index) => ({ ...row, lp: index + 1 }))}
                actions={(row) => [
                    { icon: IconName.edit, onPress: () => handleEdit(row) },
                    { icon: IconName.delete, onPress: () => handleDelete(row), iconColor: 'red' },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pageTitle: { flexShrink: 1 },
});
