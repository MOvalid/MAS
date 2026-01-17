import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table/AppTable';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { metrics } from '@/theme/metrics';
import { StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';
import { StockProductViewModel } from '@/types/view-model/product';
import { AppStockBar } from '@/components/common/AppStockBar';
import { StockListFilters } from './StockListFilters';
import { useProductStock } from '@/composables/stock/useProductStock';
import { ErrorScreen } from '../ErrorScreen';
import { LoadingScreen } from '../LoadingScreen';
import { mapStockProductListToViewModel } from '@/mappers/product.mapper';

export const StockListScreen = () => {

    const [search, setSearch] = useState('');
    const [stockLevel, setStockLevel] = useState<StockLevelFilter>(StockLevelFilter.All);
    const [sortBy, setSortBy] = useState<StockSortOption>(StockSortOption.NameAscending);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { items, total, loading, error, refetch } = useProductStock(
        search,
        stockLevel,
        sortBy,
        page,
        limit
    );

    const columns: TableColumn<StockProductViewModel>[] = [
        {
            key: 'name',
            title: 'Nazwa produktu',
            flex: 2,
            render: (item) => <AppText>{item.name}</AppText>,
        },
        {
            key: 'manufacturerName',
            title: 'Producent',
            flex: 2,
            render: (item) => <AppText>{item.manufacturerName}</AppText>,
        },
        {
            key: 'stockQuantity',
            title: 'Stan',
            flex: 2,
            align: 'center',
            render: (item) => <AppStockBar stockQuantity={item.stockQuantity} />,
        },
        { key: 'unit', title: 'Jednostka', flex: 0.5, align: 'center' },
        {
            key: 'grossPrice',
            title: 'Cena brutto',
            flex: 1,
            align: 'right',
            render: (item) => <AppText>{item.grossPrice}</AppText>,
        },
        {
            key: 'currency',
            title: 'Waluta',
            flex: 1,
            align: 'center',
        },
        {
            key: 'lastRestocked',
            title: 'Uzupełniono',
            flex: 1,
            render: (item) => <AppText>{item.lastRestocked}</AppText>,
        },
    ];

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const styles = StyleSheet.create({
        container: { flex: 1 },
        pageTitle: { flexShrink: 1, marginVertical: 20 },
        paginationRow: { marginTop: metrics.spacing.sm, width: '100%', alignItems: 'center' },
    });

    if (loading) return <LoadingScreen />;
    if (error)
        return <ErrorScreen title="Błąd ładowania danych" message={error} onRetry={refetch} />;

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineLarge" style={styles.pageTitle}>
                Stan magazynowy
            </AppText>

            <StockListFilters
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                stockLevel={stockLevel}
                onStockLevelChange={(val) => {
                    setStockLevel(val);
                    setPage(1);
                }}
                sortBy={sortBy}
                onSortByChange={(val) => {
                    setSortBy(val);
                    setPage(1);
                }}
            />

            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <AppTable columns={columns} data={mapStockProductListToViewModel(items)} />

                    <View style={styles.paginationRow}>
                        <AppPaginationControls
                            page={page}
                            totalPages={Math.max(1, Math.ceil(total / limit))}
                            onPrevious={onPrevious}
                            onNext={onNext}
                        />
                    </View>
                </>
            )}
        </ScrollView>
    );
};
