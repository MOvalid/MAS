import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { OrderListFilters } from './OrderListFilters';
import { OrderTableData } from '@/types/domain/order';
import { OrderSort, OrderStatus } from '@/types/common';
import { useSellers } from '@/composables/seller';
import { useNavigation } from '@react-navigation/native';
import { useDebounce } from '@/hooks/useDebounce';
import { useOrders2, useOrderTableData } from '@/composables/orders/useOrders';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/dto/auth';
import { ErrorScreen } from '../ErrorScreen';

export const OrderListScreen = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(OrderStatus.ALL);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [seller, setSeller] = useState('ALL');
    const [sort, setSort] = useState<OrderSort>('CREATED_DESC');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { data: sellers, loading: sellersLoading } = useSellers();

    const filters = useMemo(
        () => ({
            search: search.trim() || undefined,
            sorting: sort,
            status: status !== OrderStatus.ALL ? status : undefined,
            sellerId: seller !== 'ALL' ? seller : undefined,
            dateFrom: startDate || undefined,
            dateTo: endDate || undefined,
        }),
        [search, sort, status, seller, startDate, endDate]
    );

    const {
        data: orders,
        page,
        total,
        limit,
        loading: orderLoading,
        setPage,
        refetch,
        error,
    } = useOrders2(true, filters);

    const tableData = useOrderTableData(orders, page, limit);

    const sellerOptions = useMemo(
        () => [
            { label: 'Wszyscy sprzedawcy', value: 'ALL' },
            ...sellers.map((s) => ({
                label: `${s.firstName} ${s.lastName}`,
                value: s.id,
            })),
        ],
        [sellers]
    );

    const handleRowPress = (item: OrderTableData) => {
        navigation.navigate('Order', { id: item.id });
    };

    const loading = orderLoading || sellersLoading || false;
    const onPrevious = () => setPage((o) => Math.max(1, o - 1));
    const onNext = () => setPage((o) => Math.min(Math.ceil(total / limit), o + 1));

    const columns: TableColumn<OrderTableData>[] = [
        { key: 'lp', title: 'Lp.', flex: 0.3 },
        { key: 'createdAt', title: 'Data', flex: 1 },
        {
            key: 'customer',
            title: 'Klient',
            flex: 2,
            render: (item) => item.company || item.customer,
        },
        { key: 'seller', title: 'Sprzedawca', flex: 1 },
        { key: 'status', title: 'Status', flex: 1 },
        { key: 'invoiceNumber', title: 'Faktura', flex: 1 },
    ];

    if (error)
        return <ErrorScreen title="Błąd ładowania danych" message={error} onRetry={refetch} />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Zamówienia</AppText>
                <AppButton onPress={() => navigation.navigate('OrderAdd')}>
                    Nowe zamówienie
                </AppButton>
            </View>

            <OrderListFilters
                search={search}
                onSearchChange={(v) => {
                    setSearch(v);
                    setPage(1);
                }}
                status={status}
                onStatusChange={(v) => {
                    setStatus(v);
                    setPage(1);
                }}
                seller={seller}
                sellerOptions={sellerOptions}
                onSellerChange={(v) => {
                    setSeller(v);
                    setPage(1);
                }}
                sort={sort}
                onSortChange={(v) => {
                    setSort(v);
                    setPage(1);
                }}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(v) => {
                    setStartDate(v);
                    setPage(1);
                }}
                onEndDateChange={(v) => {
                    setEndDate(v);
                    setPage(1);
                }}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <>
                    <AppTable
                        actions={(item) => [
                            { icon: IconName.document, onPress: () => {}, tooltip: 'Faktura' },
                            {
                                icon: IconName.edit,
                                onPress: () => {
                                    navigation.navigate('Order', { id: item.id });
                                },
                                tooltip: 'Edytuj',
                            },
                            {
                                icon: IconName.delete,
                                onPress: () => {},
                                iconColor: 'red',
                                tooltip: 'Usuń',
                            },
                        ]}
                        columns={columns}
                        data={tableData}
                        onRowPress={handleRowPress}
                    />
                    {orders.length > 0 && (
                        <View style={styles.paginationRow}>
                            <AppPaginationControls
                                page={page}
                                totalPages={Math.max(1, Math.ceil(total / limit))}
                                onPrevious={onPrevious}
                                onNext={onNext}
                            />
                        </View>
                    )}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: { paddingBottom: metrics.spacing.xl },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: metrics.spacing.lg,
    },
    paginationRow: {
        marginTop: metrics.spacing.lg,
        alignItems: 'center',
    },
});
