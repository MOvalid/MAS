import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppButton } from '../../common/AppButton';
import { AppText } from '../../common/AppText';
import { AppTable } from '../../common/table/AppTable';
import { metrics } from '../../../theme/metrics';
import { IconName } from '../../common';
import { ClientListFilters } from './ClientListFilters';
import { ClientTypeFilter, ClientSort } from '@/types/common';
import { useClientActions } from '@/composables/client/useClientActions';
import { useClientTableData } from '@/composables/client/useClientTableData';
import { useClients } from '@/composables/client/useClients';
import { Company, Customer } from '@/types/domain';

export const ClientListScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();

    const [search, setSearch] = useState('');
    const [type, setType] = useState<ClientTypeFilter>('ALL');
    const [sort, setSort] = useState<ClientSort>('ALPHA_ASC');

    // Use the integrated hook
    const {
        clients: allClients,
        total,
        page,
        setPage,
        limit,
        setLimit,
        filters,
        setFilters,
        loading,
        error,
        refetch,
        onPrevious,
        onNext,
        setAllClients,
    } = useClients(true, { search, type }, 1, 100)

    const { handleEdit, handleDelete } = useClientActions((id, isCompany) => {
        // Remove from local state
        setAllClients((prev) => prev.filter((c) => c.id !== id));
        // Optionally refetch from server
        refetch();
    });

    const companies = useMemo(() => {
        return allClients.filter((c): c is Company => 'name' in c);
    }, [allClients]);


    const customers = useMemo(() => {
        return allClients.filter((c): c is Customer => 'firstName' in c);
    }, [allClients]);

    const tableData = useClientTableData(companies, customers, search, type, sort);

    const handleAddCompany = () => navigation.navigate('Company', { screen: 'CompanyAdd' });
    const handleAddCustomer = () => navigation.navigate('Customer', { screen: 'CustomerAdd' });

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setFilters({ ...filters, search: newSearch });
    };

    const handleTypeChange = (newType: ClientTypeFilter) => {
        setType(newType);
        setFilters({ ...filters, type: newType });
    };

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
                onSearchChange={handleSearchChange}
                clientType={type}
                onClientTypeChange={handleTypeChange}
                sortBy={sort}
                onSortByChange={setSort}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <AppText style={{ marginTop: metrics.spacing.md }}>
                        Ładowanie klientów...
                    </AppText>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <AppText variant="headlineSmall" style={styles.errorText}>
                        Błąd podczas ładowania
                    </AppText>
                    <AppText style={{ marginBottom: metrics.spacing.lg }}>{error}</AppText>
                    <AppButton icon={IconName.refresh} onPress={refetch}>
                        Spróbuj ponownie
                    </AppButton>
                </View>
            ) : tableData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <AppText variant="headlineSmall" style={styles.emptyText}>
                        Brak klientów
                    </AppText>
                    <AppText style={{ marginBottom: metrics.spacing.lg }}>
                        {search || type !== 'ALL'
                            ? 'Nie znaleziono klientów spełniających kryteria.'
                            : 'Dodaj pierwszego klienta lub firmę.'}
                    </AppText>
                    {!search && type === 'ALL' && (
                        <View style={{ flexDirection: 'row', gap: metrics.spacing.md }}>
                            <AppButton onPress={handleAddCompany}>Dodaj firmę</AppButton>
                            <AppButton onPress={handleAddCustomer}>Dodaj klienta</AppButton>
                        </View>
                    )}
                </View>
            ) : (
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
            )}
        </View>
    );
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: metrics.spacing.xl,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: metrics.spacing.xl,
    },
    errorText: {
        marginBottom: metrics.spacing.md,
        color: 'red',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: metrics.spacing.xl,
    },
    emptyText: {
        marginBottom: metrics.spacing.md,
    },
});
