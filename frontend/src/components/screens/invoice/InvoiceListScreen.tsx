import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
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
import {
    useGenerateInvoicePdf,
    useInvoices,
    useInvoiceTableData,
    useDeleteInvoice,
} from '@/composables/invoice/useInvoices';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorScreen } from '../ErrorScreen';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTheme } from 'react-native-paper';
import { LoadingScreen } from '../LoadingScreen';
import { canInvoiceBeDeleted } from '@/utils/invoice-utils';

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
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    const {
        data: invoices,
        page,
        setPage,
        error,
        refetch,
        total,
        limit,
        loading,
        setFilters,
    } = useInvoices(true, { search, sorting: sort });

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setFilters({
            search: debouncedSearch,
            status: status === InvoiceStatus.ALL ? undefined : status,
            sorting: sort,
            startDate: issuedStart || undefined,
            endDate: issuedEnd || undefined,
            paymentStartDate: paymentStart || undefined,
            paymentEndDate: paymentEnd || undefined,
        });
    }, [debouncedSearch, status, sort, issuedStart, issuedEnd, paymentStart, paymentEnd]);

    const { generatePdf, isGenerating } = useGenerateInvoicePdf(
        () => showSnackbar('Faktura została pobrana', 'success'),
        (err) => showSnackbar(err, 'error')
    );

    const { remove: performDelete, loading: isDeleting } = useDeleteInvoice(
        () => {
            showSnackbar('Faktura została usunięta', 'success');
            refetch();
        },
        (err) => showSnackbar(err, 'error')
    );

    const tableData = useInvoiceTableData(invoices, page, limit);

    useEffect(() => {
        if (issuedStart && issuedEnd && new Date(issuedStart) > new Date(issuedEnd)) {
            setDateError('Błędny zakres dat wystawienia faktur');
        } else {
            setDateError('');
        }
    }, [issuedStart, issuedEnd]);

    useEffect(() => {
        if (paymentStart && paymentEnd && new Date(paymentStart) > new Date(paymentEnd)) {
            setDateError('Błędny zakres terminów płatności faktur');
        } else {
            setDateError('');
        }
    }, [paymentStart, paymentEnd]);

    const handleRowPress = (item: InvoiceTableData) => {
        navigation.navigate('OrderDetails', { id: item.orderId });
    };

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const downloadInvoice = (row: InvoiceTableData) => {
        if (!row.id) {
            showSnackbar('Błąd: Nie znaleziono identyfikatora faktury', 'error');
            return;
        }
        generatePdf(row.id, row.invoiceNumber);
    };

    const deleteInvoice = (row: InvoiceTableData) => {
        if (!canInvoiceBeDeleted(row.status)) {
            showSnackbar('Można usuwać tylko faktury anulowane lub szkice', 'error');
            return;
        }

        Alert.alert(
            'Potwierdź usunięcie',
            `Czy na pewno chcesz trwale usunąć fakturę ${row.invoiceNumber}?`,
            [
                { text: 'Anuluj', style: 'cancel' },
                { 
                    text: 'Usuń', 
                    style: 'destructive', 
                    onPress: () => performDelete(row.id) 
                },
            ]
        );
    };

    const columns: TableColumn<InvoiceTableData>[] = [
        { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
        { key: 'invoiceNumber', title: 'Numer faktury', align: 'center', flex: 1 },
        { key: 'issuedAt', title: 'Data wystawienia', align: 'center', flex: 1 },
        { key: 'paymentDueDate', title: 'Data opłacenia', align: 'center', flex: 1 },
        { key: 'totalGrossPrice', title: 'Kwota', align: 'center', flex: 1 },
        { key: 'currency', title: 'Waluta', align: 'center', flex: 1 },
        { key: 'statusLabel', title: 'Status', align: 'center', flex: 1 },
    ];

    if (error)
        return <ErrorScreen title="Błąd ładowania danych" message={error} onRetry={refetch} />;

    if (isGenerating) return <LoadingScreen />;

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
                            {
                                icon: IconName.download,
                                onPress: () => downloadInvoice(row),
                                disabled: isGenerating,
                            },
                            {
                                icon: IconName.delete,
                                onPress: () => deleteInvoice(row),
                                iconColor: 'red',
                                disabled: isGenerating,
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
