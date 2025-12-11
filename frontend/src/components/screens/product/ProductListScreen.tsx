import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table/AppTable';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { ProductViewModel } from '@/types/view-model/product';
import { getMockProducts, mockCategories } from '@/utils/data-generator';
import { mapProductDtoToViewModel } from '@/mappers/product.mapper';
import { ProductListFilters } from './ProductListFilters';
import { ProductSortOption } from '@/types/common';

export const ProductListScreen = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [manufacturer, setManufacturer] = useState('ALL');
    const [sort, setSort] = useState<ProductSortOption>('NAME_ASC');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { items, total } = useMemo(() => {
        let data = [...getMockProducts(100)];

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
            );
        }

        if (manufacturer !== 'ALL') {
            data = data.filter((p) => p.manufacturer === manufacturer);
        }

        if (category !== 'ALL') {
            data = data.filter((p) => p.categoryId === category);
        }

        switch (sort) {
            case 'NAME_ASC':
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'NAME_DESC':
                data.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'MANUFACTURER_ASC':
                data.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
                break;
            case 'PRICE_ASC':
                data.sort((a, b) => a.grossPrice - b.grossPrice);
                break;
        }

        const total = data.length;
        const start = (page - 1) * limit;
        const paginated = data.slice(start, start + limit);

        return { items: paginated.map(mapProductDtoToViewModel), total };
    }, [search, category, manufacturer, sort, page]);

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const columns: TableColumn<ProductViewModel>[] = [
        { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
        { key: 'name', title: 'Nazwa', flex: 2 },
        { key: 'manufacturer', title: 'Producent', flex: 1.5 },
        { key: 'sku', title: 'SKU', flex: 1 },
        {
            key: 'categoryId',
            title: 'Kategoria',
            flex: 1,
            render: (item) => mockCategories.find((c) => c.id === item.categoryId)?.name ?? '—',
        },
        { key: 'netPrice', title: 'Cena netto', flex: 0.75, align: 'center' },
        { key: 'grossPrice', title: 'Cena brutto', flex: 0.75, align: 'center' },
        { key: 'currency', title: 'Waluta', flex: 0.5, align: 'center' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Produkty</AppText>
                <AppButton onPress={() => console.log('Nowy produkt')}>Nowy produkt</AppButton>
            </View>

            <ProductListFilters
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                category={category}
                onCategoryChange={(val) => {
                    setCategory(val);
                    setPage(1);
                }}
                manufacturer={manufacturer}
                onManufacturerChange={(val) => {
                    setManufacturer(val);
                    setPage(1);
                }}
                sort={sort}
                onSortChange={(val) => {
                    setSort(val);
                    setPage(1);
                }}
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

const styles = StyleSheet.create({
    container: { flex: 1, gap: metrics.spacing.lg },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paginationRow: { marginTop: metrics.spacing.md, width: '100%', alignItems: 'center' },
});
