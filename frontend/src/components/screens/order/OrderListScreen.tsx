import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '@/components/common';
import { Action, AppTable, TableColumn } from '@/components/common/table';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { AppModal } from '@/components/common/AppModal'; // Zaimportuj Modal
import { OrderListFilters } from './OrderListFilters';
import { OrderTableData } from '@/types/domain/order';
import { OrderSort, OrderStatus } from '@/types/common';
import { useSellers } from '@/composables/seller';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useOrders2, useOrderTableData } from '@/composables/orders/useOrders';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/dto/auth';
import { ErrorScreen } from '../ErrorScreen';
import { useOrderActions } from '@/hooks/useOrderActions'; // Import hooka akcji
import { useGenerateInvoicePdf } from '@/composables/invoice/useInvoices';
import { useSnackbar } from '@/context/SnackbarContext';

export const OrderListScreen = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(OrderStatus.ALL);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [seller, setSeller] = useState('ALL');
    const [sort, setSort] = useState<OrderSort>('CREATED_DESC');

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();
    const { showSnackbar } = useSnackbar();

    const { data: sellers, loading: sellersLoading } = useSellers();

    const {
        data: orders,
        page,
        error,
        refetch,
        setPage,
        total,
        limit,
        loading: orderLoading,
        setFilters,
    } = useOrders2(true, { search, sorting: sort });

    const { handleDeleteOrder, isLoading: isDeleting } = useOrderActions(
        selectedOrderId || '',
        '',
        refetch
    );

    useEffect(() => {
        setFilters({
            search: search.trim(),
            sorting: sort,
            status: status !== OrderStatus.ALL ? status : undefined,
            sellerId: seller !== 'ALL' ? seller : undefined,
            dateFrom: startDate || undefined,
            dateTo: endDate || undefined,
        });
    }, [search, sort, status, seller, startDate, endDate]);

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
        navigation.navigate('OrderDetails', { id: item.id });
    };

    const openDeleteModal = (id: string) => {
        setSelectedOrderId(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        await handleDeleteOrder();
        setDeleteModalVisible(false);
        setSelectedOrderId(null);
    };

    const loading = orderLoading || sellersLoading || isDeleting;
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
        { key: 'statusLabel', title: 'Status', flex: 1 },
        { key: 'invoiceNumber', title: 'Faktura', align: 'center', flex: 1 },
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

            {loading && !orders.length ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <>
                    <AppTable
                        actions={(item) => {
                            const isDraft = item.status === OrderStatus.DRAFT;
                            return [
                                {
                                    icon: IconName.edit,
                                    onPress: () =>
                                        navigation.navigate('OrderEdit', { id: item.id }),
                                    tooltip: 'Edytuj',
                                },
                                {
                                    icon: IconName.delete,
                                    onPress: () => openDeleteModal(item.id),
                                    iconColor: theme.colors.error,
                                    tooltip: 'Usuń',
                                    disabled: !isDraft,
                                },
                            ];
                        }}
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

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń zamówienie
                </AppText>
                <AppText style={styles.modalText}>
                    Czy na pewno chcesz nieodwracalnie usunąć to zamówienie?
                </AppText>
                <View style={styles.modalButtons}>
                    <AppButton mode="outlined" onPress={() => setDeleteModalVisible(false)}>
                        Anuluj
                    </AppButton>
                    <AppButton
                        buttonColor={theme.colors.error}
                        loading={isDeleting}
                        onPress={confirmDelete}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        padding: metrics.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: { paddingBottom: metrics.spacing.xl },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: metrics.spacing.lg,
        marginTop: metrics.spacing.md,
        marginBottom: metrics.spacing.lg,
    },
    paginationRow: {
        marginTop: metrics.spacing.lg,
        alignItems: 'center',
    },
    modalTitle: { textAlign: 'center', marginBottom: metrics.spacing.md },
    modalText: { textAlign: 'center', marginBottom: metrics.spacing.lg },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: metrics.spacing.md },
});
