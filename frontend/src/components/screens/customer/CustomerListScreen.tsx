import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, IconName } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { ClientListFilters } from '../client/ClientListFilters';
import { useCustomers, useCustomerTableData } from '@/composables/customer/useCustomers';
import { AppTable } from '@/components/common/table';
import { CustomerSort } from '@/types/common';
import { ErrorMessage } from '@/components/common/AppStageMessage';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';

export const CustomerListScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<CustomerSort>('ALPHA_ASC');

    const {
        data: customers,
        page,
        setPage,
        total,
        limit,
        loading,
        error,
        refetch,
        setFilters,
    } = useCustomers(true, { search, sortBy: sort });

    const tableData = useCustomerTableData(customers, page, limit);

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
    };

    const handleSortChange = (newSort: CustomerSort) => {
        setSort(newSort);
    };

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    useEffect(() => {
        setFilters({
            search: search,
            sortBy: sort,
        });
    }, [search, sort, setFilters]);

    const styles = StyleSheet.create({
        container: { flex: 1, gap: metrics.spacing.lg },
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
        paginationRow: {
            marginTop: metrics.spacing.md,
            width: '100%',
            alignItems: 'center',
        },
    });

    if (error) {
        return <ErrorMessage error={error} onRetry={refetch} onBack={() => navigation.goBack()} />;
    }

    return (
        <ScrollView style={styles.container}>
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
                        {
                            icon: IconName.delete,
                            onPress: () => console.log('Usuwanie klienta'),
                        },
                    ]}
                />
            )}

            {tableData.length > 0 && !loading && (
                <View style={styles.paginationRow}>
                    <AppPaginationControls
                        page={page}
                        totalPages={Math.max(1, Math.ceil(total / limit))}
                        onPrevious={onPrevious}
                        onNext={onNext}
                    />
                </View>
            )}
        </ScrollView>
    );
};
