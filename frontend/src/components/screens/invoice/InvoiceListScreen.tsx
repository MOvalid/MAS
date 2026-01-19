import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AppText, AppButton, IconName } from '@/components/common';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { AppTable, TableColumn } from '@/components/common/table';
import { metrics } from '@/theme/metrics';
import { InvoiceSort, InvoiceStatus } from '@/types/common';
import { InvoiceTableData } from '@/types/domain';
import { InvoiceListFilters } from './InvoiceListFilters';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/dto/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useInvoices, useInvoiceTableData } from '@/composables/invoice/useInvoices';
import { useDebounce } from '@/hooks/useDebounce';

export const InvoiceListScreen = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.ALL);
    const [sort, setSort] = useState<InvoiceSort>('ISSUED_DESC');

    const [issuedStart, setIssuedStart] = useState('');
    const [issuedEnd, setIssuedEnd] = useState('');
    const [paymentStart, setPaymentStart] = useState('');
    const [paymentEnd, setPaymentEnd] = useState('');
    const [dateError, setDateError] = useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const debouncedSearch = useDebounce(search, 500);

    const { data: invoices, page, setPage, total, limit, loading, setFilters } = useInvoices(true);

    const activeFilters = useMemo(
        () => ({
            search: debouncedSearch,
            status: status === InvoiceStatus.ALL ? undefined : status,
            sorting: sort,
            startDate: issuedStart,
            endDate: issuedEnd,
            paymentStartDate: paymentStart,
            paymentEndDate: paymentEnd,
        }),
        [debouncedSearch, status, sort, issuedStart, issuedEnd, paymentStart, paymentEnd]
    );

    useEffect(() => {
        setFilters(activeFilters);
        setPage(1);
    }, [activeFilters]);

    const tableData = useInvoiceTableData(invoices, page, limit);

    useEffect(() => {
        if (issuedStart && issuedEnd && new Date(issuedStart) > new Date(issuedEnd)) {
            setDateError('Błędny zakres dat wystawienia');
        } else {
            setDateError('');
        }
    }, [issuedStart, issuedEnd]);

    const handleRowPress = (item: InvoiceTableData) => {
        navigation.navigate('OrderDetails', { id: item.orderId });
    };

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const downloadInvoice = (row: InvoiceTableData) => console.log('Download', row);
    const deleteInvoice = (row: InvoiceTableData) => console.log('Delete', row);

    const columns: TableColumn<InvoiceTableData>[] = [
        { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
        { key: 'invoiceNumber', title: 'Numer faktury', align: 'center', flex: 1 },
        { key: 'issuedAt', title: 'Data wystawienia', align: 'center', flex: 1 },
        { key: 'paymentDueDate', title: 'Data opłacenia', align: 'center', flex: 1 },
        { key: 'totalGrossPrice', title: 'Kwota', align: 'center', flex: 1 },
        { key: 'currency', title: 'Waluta', align: 'center', flex: 1 },
        { key: 'status', title: 'Status', align: 'center', flex: 1 },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Faktury</AppText>
                <AppButton disabled={true} onPress={() => console.log('Nowa faktura')}>
                    Nowa faktura
                </AppButton>
            </View>

            <InvoiceListFilters
                search={search}
                onSearchChange={setSearch}
                startDate={issuedStart}
                endDate={issuedEnd}
                onStartDateChange={setIssuedStart}
                onEndDateChange={setIssuedEnd}
                paymentStartDate={paymentStart}
                paymentEndDate={paymentEnd}
                onPaymentStartDateChange={setPaymentStart}
                onPaymentEndDateChange={setPaymentEnd}
                status={status}
                onStatusChange={setStatus}
                sort={sort}
                onSortChange={(val) => setSort(val as InvoiceSort)}
                dateError={dateError}
            />
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <>
                    <AppTable
                        columns={columns}
                        data={tableData}
                        onRowPress={handleRowPress}
                        actions={(row) => [
                            { icon: IconName.download, onPress: () => downloadInvoice(row) },
                            {
                                icon: IconName.delete,
                                onPress: () => deleteInvoice(row),
                                iconColor: 'red',
                            },
                        ]}
                    />

                    {invoices.length > 0 && (
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: { flex: 1, gap: metrics.spacing.lg },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paginationRow: { marginTop: metrics.spacing.md, width: '100%', alignItems: 'center' },
});
