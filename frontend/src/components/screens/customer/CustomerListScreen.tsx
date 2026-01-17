import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, IconName } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { ClientListFilters } from '../client/ClientListFilters';
import { useCustomers, useCustomerTableData } from '@/composables/customer/useCustomers';
import { AppTable } from '@/components/common/table';
import { CustomerSort } from '@/types/common';
import { ErrorMessage } from '@/components/common/AppStageMessage';

export const CustomerListScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<CustomerSort>('ALPHA_ASC');

    const { customers, page, setPage, limit, loading, error, refetch, setFilters } = useCustomers(
        true,
        { search, sortBy: sort }
    );

    const tableData = useCustomerTableData(customers, page, limit);

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
        setFilters((prev) => ({ ...prev, search: newSearch }));
    };

    const handleSortChange = (newSort: CustomerSort) => {
        setSort(newSort);
        setPage(1);
        setFilters((prev) => ({ ...prev, sortBy: newSort }));
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: metrics.spacing.lg,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: metrics.spacing.lg,
        },
        pageTitle: {
            flexShrink: 1,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    if (error) {
        return <ErrorMessage error={error} onRetry={refetch} onBack={() => navigation.goBack()} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge" style={styles.pageTitle}>
                    Klienci
                </AppText>
                <AppButton onPress={() => navigation.navigate('CustomerAdd')}>
                    Nowy klient
                </AppButton>
            </View>

            <ClientListFilters
                search={search}
                onSearchChange={handleSearchChange}
                sortBy={sort}
                onSortByChange={handleSortChange}
                searchLabel="Wyszukaj klienta"
                options={[
                    { label: 'Nazwisko A → Z', value: 'ALPHA_ASC' },
                    { label: 'Nazwisko Z → A', value: 'ALPHA_DESC' },
                ]}
            />

            {loading && page === 1 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <AppTable
                    columns={[
                        { key: 'lp', title: 'Lp.', flex: 0.3 },
                        { key: 'firstName', title: 'Imię', flex: 1 },
                        { key: 'lastName', title: 'Nazwisko', flex: 1 },
                        { key: 'email', title: 'Email', flex: 1.2 },
                        { key: 'phone', title: 'Telefon', flex: 1 },
                        { key: 'address', title: 'Adres', flex: 1.5 },
                    ]}
                    data={tableData}
                    actions={(row) => [
                        {
                            icon: IconName.edit,
                            onPress: () => navigation.navigate('CustomerEdit', { id: row.id }),
                        },
                    ]}
                />
            )}
        </View>
    );
};
