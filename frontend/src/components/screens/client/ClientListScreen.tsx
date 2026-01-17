import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../common/AppButton';
import { AppText } from '../../common/AppText';
import { AppTable } from '../../common/table/AppTable';
import { metrics } from '../../../theme/metrics';
import { IconName } from '../../common';
import { ClientListFilters } from './ClientListFilters';
import { ClientTypeFilter, ClientSort } from '@/types/common';
import { useClientActions } from '@/composables/client/useClientActions';
import { useClientTableData } from '@/composables/client/useClientTableData';
import { useCompanies } from '@/composables/company/useCompanies';
import { useCustomers } from '@/composables/customer/useCustomers';

export const ClientListScreen = () => {
    const navigation = useNavigation();

    const [search, setSearch] = useState('');
    const [type, setType] = useState<ClientTypeFilter>('ALL');
    const [sort, setSort] = useState<ClientSort>('ALPHA_ASC');

    const { companies, setCompanies } = useCompanies();
    const { customers, setCustomers } = useCustomers();

    const { handleEdit, handleDelete } = useClientActions((id, isCompany) => {
        if (isCompany) {
            setCompanies((prev) => prev.filter((c) => c.id !== id));
        } else {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
        }
    });

    const tableData = useClientTableData(companies, customers, search, type, sort);

    const handleAddCompany = () => navigation.navigate('Company', { screen: 'CompanyAdd' });
    const handleAddCustomer = () => navigation.navigate('Customer', { screen: 'CustomerAdd' });

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
                data={tableData}
                actions={(row) => [
                    { icon: IconName.edit, onPress: () => handleEdit(row.id, row.isCompany) },
                    {
                        icon: IconName.delete,
                        onPress: () => handleDelete(row.id, row.isCompany, row.name),
                        iconColor: 'red',
                    },
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
