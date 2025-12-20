import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '@/components/common';
import { AppTable, TableColumn } from '@/components/common/table';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { OrderViewModel } from '@/types/view-model/order';
import { getMockOrders, getMockSellers } from '@/utils/data-generator';
import { mapOrderListToViewModel } from '@/mappers/order.mapper';
import { OrderListFilters } from './OrderListFilters';
import { OrderSortOption } from '@/types/domain/order';
import { OrderStatus } from '@/types/common';

const mockOrders = getMockOrders(120);
const mockSellers = getMockSellers(10, mockOrders);
const sellerOptions = [
    { label: 'Wszyscy', value: 'ALL' },
    ...mockSellers.map((s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id })),
];

export const OrderListScreen = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<OrderStatus>(OrderStatus.ALL);
    const [seller, setSeller] = useState('ALL');
    const [sort, setSort] = useState<OrderSortOption>('CREATED_DESC');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { items, total } = useMemo(() => {
        let data = [...mockOrders];

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (o) =>
                    o.customer?.toLowerCase().includes(q) ||
                    o.company?.toLowerCase().includes(q) ||
                    o.invoiceNumber?.toLowerCase().includes(q)
            );
        }

        if (status !== 'ALL') {
            data = data.filter((o) => o.status === status);
        }

        if (seller !== 'ALL') {
            data = data.filter((o) => o.seller === seller);
        }

        if (startDate) {
            const start = new Date(`${startDate}T00:00:00`);
            data = data.filter((o) => new Date(o.createdAt) >= start);
        }
        if (endDate) {
            const end = new Date(`${endDate}T23:59:59`);
            data = data.filter((o) => new Date(o.createdAt) <= end);
        }

        data.sort((a, b) => {
            switch (sort) {
                case 'CREATED_ASC':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'CREATED_DESC':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'CUSTOMER_ASC':
                    return (a.customer ?? '').localeCompare(b.customer ?? '');
                case 'COMPANY_ASC':
                    return (a.company ?? '').localeCompare(b.company ?? '');
                default:
                    return 0;
            }
        });

        const total = data.length;
        const start = (page - 1) * limit;
        const paginated = data.slice(start, start + limit);

        return { items: mapOrderListToViewModel(paginated), total };
    }, [search, status, seller, sort, startDate, endDate, page]);

    const generateInvoice = (row: OrderViewModel) => console.log('Generuj fakturę', row);
    const editOrder = (row: OrderViewModel) => console.log('Edytuj', row);
    const cancelOrder = (row: OrderViewModel) => console.log('Anuluj', row);

    const columns: TableColumn<OrderViewModel>[] = [
        { key: 'lp', title: 'Lp.', flex: 0.3 },
        { key: 'createdAt', title: 'Data zamówienia', flex: 1 },
        { key: 'customer', title: 'Klient', flex: 1.5 },
        { key: 'company', title: 'Firma', flex: 1.5 },
        { key: 'seller', title: 'Sprzedawca', flex: 1 },
        {
            key: 'status',
            title: 'Status',
            flex: 1,
        },
        { key: 'invoiceNumber', title: 'Faktura', flex: 1 },
    ] as TableColumn<OrderViewModel>[];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Zamówienia</AppText>
                <AppButton onPress={() => console.log('Nowe zamówienie')}>
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
                onSellerChange={(v) => {
                    setSeller(v);
                    setPage(1);
                }}
                sellerOptions={sellerOptions}
                sortBy={sort}
                onSortByChange={(v) => {
                    setSort(v);
                    setPage(1);
                }}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            <AppTable
                columns={columns}
                data={items}
                actions={(row) => [
                    {
                        icon: IconName.document,
                        onPress: () => generateInvoice(row),
                        tooltip: 'Generuj fakturę',
                    },
                    {
                        icon: IconName.edit,
                        onPress: () => editOrder(row),
                        tooltip: 'Edytuj zamówienie',
                    },
                    {
                        icon: IconName.delete,
                        onPress: () => cancelOrder(row),
                        iconColor: 'red',
                        tooltip: 'Usuń zamówienie',
                    },
                ]}
            />

            <View style={styles.paginationRow}>
                <AppPaginationControls
                    page={page}
                    totalPages={Math.max(1, Math.ceil(total / limit))}
                    onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, gap: metrics.spacing.lg },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paginationRow: { marginTop: metrics.spacing.md, alignItems: 'center' },
});
