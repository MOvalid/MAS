// StockListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppCard, AppText } from '@/components/common';
import { AppTable } from '@/components/common/table/AppTable';
import { metrics } from '@/theme/metrics';
import { useProductStock } from '@/composables/useProductStock';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';

export const StockListScreen = () => {
    const theme = useTheme();

    const [search, setSearch] = useState('');
    const [stockLevel, setStockLevel] = useState<StockLevelFilter>(StockLevelFilter.All);
    const [sortBy, setSortBy] = useState<StockSortOption>(StockSortOption.NameAscending);

    const [page, setPage] = useState(1);
    const limit = 20;

    const { items, total, loading, error, refetch } = useProductStock({
        search,
        stockLevel,
        sortBy,
        page,
        limit,
    });

    useEffect(() => {
        refetch();
    }, [search, stockLevel, sortBy, page, refetch]);

    const styles = StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg },
        card: { paddingVertical: metrics.spacing.md },
        filtersRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
            flexWrap: 'wrap',
            marginBottom: metrics.spacing.lg,
        },
        paginationRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: metrics.spacing.lg,
        },
    });

    const stockLevelOptions = [
        { label: 'All', value: StockLevelFilter.All },
        { label: 'None', value: StockLevelFilter.None },
        { label: 'Low', value: StockLevelFilter.Low },
        { label: 'Medium', value: StockLevelFilter.Medium },
        { label: 'High', value: StockLevelFilter.High },
    ];

    const sortOptions = [
        { label: 'Name A → Z', value: StockSortOption.NameAscending },
        { label: 'Name Z → A', value: StockSortOption.NameDescending },
        { label: 'Stock ↑', value: StockSortOption.StockAscending },
        { label: 'Stock ↓', value: StockSortOption.StockDescending },
    ];

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={{ marginBottom: metrics.spacing.lg }}>
                Inventory Stock Levels
            </AppText>

            <AppCard style={styles.card}>
                <View style={styles.filtersRow}>
                    <View style={{ flex: 2 }}>
                        <AppAutocomplete
                            label="Search product"
                            value={{ label: search, value: search }}
                            options={[]}
                            getOptionLabel={(o) => o.label}
                            onChange={(o) => setSearch(o?.value ?? '')}
                            placeholder="Product name..."
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <AppAutocomplete
                            label="Stock level"
                            value={stockLevelOptions.find((o) => o.value === stockLevel)}
                            options={stockLevelOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={(o) => o && setStockLevel(o.value)}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <AppAutocomplete
                            label="Sort by"
                            value={sortOptions.find((o) => o.value === sortBy)}
                            options={sortOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={(o) => o && setSortBy(o.value)}
                        />
                    </View>
                </View>

                {/* {loading ? (
                    <ActivityIndicator size="large" />
                ) : ( */}
                <AppTable
                    title="Products"
                    columns={[
                        { key: 'name', title: 'Product', flex: 2 },
                        { key: 'stock', title: 'Stock', flex: 1, align: 'center' },
                        { key: 'unit', title: 'Unit', flex: 1, align: 'center' },
                    ]}
                    data={items}
                />

                <View style={styles.paginationRow}>
                    <AppPaginationControls
                        page={page}
                        totalPages={Math.max(1, Math.ceil(total / limit))}
                        onPrevious={onPrevious}
                        onNext={onNext}
                    />
                </View>
            </AppCard>
        </ScrollView>
    );
};
