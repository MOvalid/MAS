import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table/AppTable';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { ProductListFilters } from './ProductListFilters';
import { ProductSort } from '@/types/common';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/dto/auth';
import { useCategories } from '@/composables/category';
import { useProducts, useProductTableData } from '@/composables/product/useProducts';
import { ProductTableData } from '@/types/domain';
import { useDebounce } from '@/hooks/useDebounce';

export const ProductListScreen = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [manufacturer, setManufacturer] = useState('ALL');
    const [sort, setSort] = useState<ProductSort>('NAME_ASC');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { data: categories, loading: categoriesLoading } = useCategories();
    const {
        data: products,
        page,
        setPage,
        total,
        limit,
        loading,
        setFilters,
    } = useProducts(true, { search, sortBy: sort });

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setFilters({
            search: debouncedSearch,
            sortBy: sort,
            categoryId: category === 'ALL' ? undefined : category,
        });
    }, [debouncedSearch, sort, category]);

    const tableData = useProductTableData(products, page, limit);

    const categoryOptions = useMemo(() => {
        return Object.fromEntries(categories.map((c) => [c.id, c.name]));
    }, [categories]);

    const handleRowPress = (item: ProductTableData) => {
        navigation.navigate('ProductDetails', { id: item.id });
    };

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const columns: TableColumn<ProductTableData>[] = [
        { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
        { key: 'name', title: 'Nazwa', flex: 2 },
        { key: 'manufacturer', title: 'Producent', flex: 1.5 },
        {
            key: 'categoryId',
            title: 'Kategoria',
            flex: 1,
            render: (item) => (item.categoryId ? (categoryOptions[item.categoryId] ?? '—') : '—'),
        },
        { key: 'netPrice', title: 'Cena netto', flex: 0.75, align: 'center' },
        { key: 'grossPrice', title: 'Cena brutto', flex: 0.75, align: 'center' },
        { key: 'currency', title: 'Waluta', flex: 0.5, align: 'center' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Produkty</AppText>
                <AppButton onPress={() => navigation.navigate('ProductAdd')}>
                    Nowy produkt
                </AppButton>
            </View>

            <ProductListFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                categories={[{ id: 'ALL', name: 'Wszystkie' }, ...categories]}
                categoriesLoading={categoriesLoading}
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

            <AppTable
                columns={columns}
                data={tableData}
                onRowPress={handleRowPress}
                actions={(row) => [
                    {
                        icon: IconName.edit,
                        onPress: () => navigation.navigate('ProductEdit', { id: row.id }),
                    },
                    {
                        icon: IconName.delete,
                        onPress: () => console.log('Usuwanie produktu'),
                    },
                ]}
            />

            {products.length > 0 && !loading && (
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

const styles = StyleSheet.create({
    container: { flex: 1, gap: metrics.spacing.lg },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginationRow: {
        marginTop: metrics.spacing.md,
        width: '100%',
        alignItems: 'center',
    },
});
