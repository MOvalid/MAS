// StockListScreen.tsx
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table/AppTable';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { metrics } from '@/theme/metrics';
import { StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';
import { StockProductDto } from '@/types/dto/product';
import { AppStockBar } from '@/components/common/AppStockBar';
import { getMockStockProducts } from '@/utils/data-generator';
import { mapStockList } from '@/mappers/product.mapper';
import { StockProductViewModel } from '@/types/view-model/product';
import { StockListFilters } from './StockListFilters';

const mockAllProducts: StockProductDto[] = getMockStockProducts(200);

export const StockListScreen = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [stockLevel, setStockLevel] = useState<StockLevelFilter>(StockLevelFilter.All);
    const [sortBy, setSortBy] = useState<StockSortOption>(StockSortOption.NameAscending);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { items, total } = useMemo(() => {
        let data = [...mockAllProducts];

        if (stockLevel !== StockLevelFilter.All) {
            data = data.filter((p) => {
                if (stockLevel === StockLevelFilter.None) return p.stockQuantity === 0;
                if (stockLevel === StockLevelFilter.Low)
                    return p.stockQuantity > 0 && p.stockQuantity < 30;
                if (stockLevel === StockLevelFilter.Medium)
                    return p.stockQuantity >= 30 && p.stockQuantity < 100;
                if (stockLevel === StockLevelFilter.High) return p.stockQuantity >= 100;
                return true;
            });
        }

        if (search.trim()) {
            data = data.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.manufacturer?.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        switch (sortBy) {
            case StockSortOption.NameAscending:
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case StockSortOption.NameDescending:
                data.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case StockSortOption.ManufacturerAscending:
                data.sort((a, b) =>
                    (a.manufacturer?.name ?? '').localeCompare(b.manufacturer?.name ?? '')
                );
                break;
            case StockSortOption.ManufacturerDescending:
                data.sort((a, b) =>
                    (b.manufacturer?.name ?? '').localeCompare(a.manufacturer?.name ?? '')
                );
                break;
            case StockSortOption.StockAscending:
                data.sort((a, b) => a.stockQuantity - b.stockQuantity);
                break;
            case StockSortOption.StockDescending:
                data.sort((a, b) => b.stockQuantity - a.stockQuantity);
                break;
        }

        const total = data.length;
        const start = (page - 1) * limit;
        const paginated = data.slice(start, start + limit);

        const mapped = mapStockList(paginated);

        return { items: mapped, total };
    }, [search, stockLevel, sortBy, page]);

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

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

    const styles = StyleSheet.create({
        container: { flex: 1 },
        card: { paddingVertical: metrics.spacing.md, paddingHorizontal: metrics.spacing.md },
        filtersRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: metrics.spacing.md,
            marginBottom: metrics.spacing.sm,
        },
        filterItem: { justifyContent: 'flex-start' },
        labelText: { color: theme.colors.onSurfaceVariant, marginBottom: metrics.spacing.xs },
        paginationRow: { marginTop: metrics.spacing.sm, width: '100%', alignItems: 'center' },
        pageTitle: { flexShrink: 1, marginVertical: 20 },
    });

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineLarge" style={styles.pageTitle}>
                Stan magazynowy
            </AppText>

            <StockListFilters
                search={search}
                onSearchChange={setSearch}
                stockLevel={stockLevel}
                onStockLevelChange={setStockLevel}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            <AppTable columns={columns} data={items} />

            <View style={styles.paginationRow}>
                <AppPaginationControls
                    page={page}
                    totalPages={Math.max(1, Math.ceil(total / limit))}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            </View>
        </ScrollView>
    );
};
