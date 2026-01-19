import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table/AppTable';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { metrics } from '@/theme/metrics';
import { AppStockBar } from '@/components/common/AppStockBar';
import { StockListFilters } from './StockListFilters';
import { ErrorScreen } from '../ErrorScreen';
import { LoadingScreen } from '../LoadingScreen';
import { useProducts, useStockProductTableData } from '@/composables/product/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { StockProductTableData } from '@/types/domain';
import { ProductSort } from '@/types/common';
import { StockLevelFilter } from '@/types/domain/stock-filters';
import { RootStackParamList } from '@/types/dto/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatPolishDate } from '@/utils/formatters';

export const StockListScreen = () => {
    const [search, setSearch] = useState('');
    const [stockLevel, setStockLevel] = useState<StockLevelFilter>(StockLevelFilter.All);
    const [sort, setSort] = useState<ProductSort>('NAME_ASC');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const {
        data: products,
        page,
        error,
        refetch,
        setPage,
        total,
        limit,
        loading,
        setFilters,
    } = useProducts(true, { search, sorting: sort });

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setFilters({
            search: debouncedSearch,
            sorting: sort,
            stockLevel: stockLevel === 'ALL' ? undefined : stockLevel,
        });
    }, [debouncedSearch, sort, stockLevel]);

    const tableData = useStockProductTableData(products, page, limit);

    const columns: TableColumn<StockProductTableData>[] = [
        { key: 'lp', title: 'Lp.', align: 'left', flex: 0.5 },
        {
            key: 'name',
            title: 'Nazwa',
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
            flex: 0.5,
            align: 'center',
        },
        {
            key: 'lastRestockedAt',
            title: 'Uzupełniono',
            flex: 1.5,
            render: (item) => <AppText>{formatPolishDate(item.lastRestockedAt)}</AppText>,
        },
    ];

    const handleRowPress = (item: StockProductTableData) => {
        console.log('Row pressed! ID: ' + item.id);
        navigation.navigate('Product', { id: item.id });
    };

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const styles = StyleSheet.create({
        container: { flex: 1 },
        pageTitle: { flexShrink: 1, marginVertical: 20 },
        paginationRow: { marginTop: metrics.spacing.sm, width: '100%', alignItems: 'center' },
    });

    if (error)
        return <ErrorScreen title="Błąd ładowania danych" message={error} onRetry={refetch} />;

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineLarge" style={styles.pageTitle}>
                Stan magazynowy
            </AppText>

            <StockListFilters
                search={search}
                onSearchChange={setSearch}
                stockLevel={stockLevel}
                onStockLevelChange={(val) => {
                    setStockLevel(val);
                    setPage(1);
                }}
                sort={sort}
                onSortChange={(val) => {
                    setSort(val);
                    setPage(1);
                }}
            />

            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <AppTable columns={columns} data={tableData} onRowPress={handleRowPress} />

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
