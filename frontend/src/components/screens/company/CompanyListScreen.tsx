import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, IconName } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { ClientListFilters } from '../client/ClientListFilters';
import { useCompanies, useCompanyTableData } from '@/composables/company/useCompanies';
import { AppTable } from '@/components/common/table';
import { CompanySort } from '@/types/common';
import { ErrorMessage } from '@/components/common/AppStageMessage';

export const CompanyListScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<CompanySort>('ALPHA_ASC');

    const { companies, page, setPage, limit, loading, error, refetch, setFilters } = useCompanies(
        true,
        { search, sortBy: sort }
    );

    const tableData = useCompanyTableData(companies, page, limit);

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
        setFilters((prev) => ({ ...prev, search: newSearch }));
    };

    const handleSortChange = (newSort: CompanySort) => {
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
        errorText: {
            color: 'red',
            marginBottom: metrics.spacing.md,
        },
    });

    if (error) {
        return <ErrorMessage error={error} onRetry={refetch} onBack={() => navigation.goBack()} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Firmy</AppText>
                <AppButton onPress={() => navigation.navigate('CompanyAdd')}>Nowa firma</AppButton>
            </View>

            <ClientListFilters
                search={search}
                onSearchChange={handleSearchChange}
                sortBy={sort}
                onSortByChange={handleSortChange}
                searchLabel="Wyszukaj firmę"
                options={[
                    { label: 'Nazwa A → Z', value: 'ALPHA_ASC' },
                    { label: 'Nazwa Z → A', value: 'ALPHA_DESC' },
                ]}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <AppTable
                    columns={[
                        { key: 'lp', title: 'Lp.', flex: 0.3 },
                        { key: 'name', title: 'Nazwa firmy', flex: 1.5 },
                        { key: 'taxId', title: 'NIP', flex: 1 },
                        { key: 'email', title: 'Email', flex: 1.2 },
                        { key: 'address', title: 'Siedziba', flex: 1.5 },
                    ]}
                    data={tableData}
                    actions={(row) => [
                        {
                            icon: IconName.edit,
                            onPress: () => navigation.navigate('CompanyEdit', { id: row.id }),
                        },
                    ]}
                />
            )}
        </View>
    );
};
