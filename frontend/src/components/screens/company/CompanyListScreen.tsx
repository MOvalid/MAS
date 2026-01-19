import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, IconName } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { ClientListFilters } from '../client/ClientListFilters';
import { useCompanies, useCompanyTableData } from '@/composables/company/useCompanies';
import { AppTable } from '@/components/common/table';
import { CompanySort } from '@/types/common';
import { ErrorMessage } from '@/components/common/AppStageMessage';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { LoadingScreen } from '../LoadingScreen';

export const CompanyListScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<CompanySort>('ALPHA_ASC');

    const {
        data: companies,
        page,
        setPage,
        limit,
        total,
        loading,
        error,
        refetch,
        setFilters,
    } = useCompanies(true, { search, sortBy: sort });

    const tableData = useCompanyTableData(companies, page, limit);
    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
    };

    const handleSortChange = (newSort: CompanySort) => {
        setSort(newSort);
    };

    useEffect(() => {
        setFilters({
            search: search,
            sortBy: sort,
        });
    }, [search, sort, setFilters]);

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

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
        errorText: {
            color: 'red',
            marginBottom: metrics.spacing.md,
        },
        paginationRow: {
            marginTop: metrics.spacing.md,
            width: '100%',
            alignItems: 'center',
        },
    });

    if (loading) <LoadingScreen />

    if (error) {
        return <ErrorMessage error={error} onRetry={refetch} onBack={() => navigation.goBack()} />;
    }

    return (
        <ScrollView style={styles.container}>
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
                        {
                            icon: IconName.delete,
                            onPress: () => console.log('Usuwanie firmy'),
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
