import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AppText, AppButton, IconName } from '@/components/common';
import { AppModal } from '@/components/common/AppModal'; // Zaimportuj AppModal
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

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceTableData | null>(null);

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
            setIsDeleteModalVisible(false);
            setInvoiceToDelete(null);
            refetch();
        },
        (err) => showSnackbar(err, 'error')
    );

    const tableData = useInvoiceTableData(invoices, page, limit);

    const downloadInvoice = (row: InvoiceTableData) => {
        if (!row.id) {
            showSnackbar('Błąd: Nie znaleziono identyfikatora faktury', 'error');
            return;
        }
        generatePdf(row.id, row.invoiceNumber);
    };

    const handleDeletePress = (row: InvoiceTableData) => {
        if (!canInvoiceBeDeleted(row.status)) {
            showSnackbar('Można usuwać tylko faktury anulowane lub szkice', 'error');
            return;
        }
        setInvoiceToDelete(row);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (invoiceToDelete?.id) {
            performDelete(invoiceToDelete.id);
        }
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

    if (isGenerating || isDeleting) return <LoadingScreen />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
                        onRowPress={(item) =>
                            navigation.navigate('Order', {
                                screen: 'OrderDetails',
                                params: { id: item.orderId },
                            })
                        }
                        actions={(row) => [
                            {
                                icon: IconName.download,
                                onPress: () => downloadInvoice(row),
                                disabled: isGenerating,
                            },
                            {
                                icon: IconName.delete,
                                onPress: () => handleDeletePress(row),
                                iconColor: theme.colors.error,
                                disabled: isGenerating,
                            },
                        ]}
                    />

                    {invoices.length > 0 && (
                        <View style={styles.paginationRow}>
                            <AppPaginationControls
                                page={page}
                                totalPages={Math.max(1, Math.ceil(total / limit))}
                                onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                                onNext={() =>
                                    setPage((p) => Math.min(Math.ceil(total / limit), p + 1))
                                }
                            />
                        </View>
                    )}
                </>
            )}

            <AppModal visible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń fakturę
                </AppText>

                <View style={styles.modalTextContainer}>
                    <AppText style={styles.modalText}>
                        Czy na pewno chcesz trwale usunąć fakturę{' '}
                        <AppText style={{ fontWeight: 'bold' }}>
                            {invoiceToDelete?.invoiceNumber}
                        </AppText>
                        ? Tej operacji nie można cofnąć.
                    </AppText>
                </View>

                <View style={styles.modalButtons}>
                    <AppButton
                        mode="outlined"
                        onPress={() => setIsDeleteModalVisible(false)}
                        style={styles.modalButton}
                    >
                        Anuluj
                    </AppButton>
                    <AppButton
                        buttonColor={theme.colors.error}
                        onPress={confirmDelete}
                        style={styles.modalButton}
                        loading={isDeleting}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: metrics.spacing.xl,
    },
    container: { flex: 1 },
    content: { paddingBottom: metrics.spacing.xl, gap: metrics.spacing.lg },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: metrics.spacing.md,
        marginTop: metrics.spacing.md,
    },
    paginationRow: { marginTop: metrics.spacing.md, width: '100%', alignItems: 'center' },
    modalTitle: { textAlign: 'center', marginBottom: metrics.spacing.md },
    modalTextContainer: {
        maxWidth: 300,
        alignSelf: 'center',
        marginBottom: metrics.spacing.lg,
    },
    modalText: {
        textAlign: 'center',
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: metrics.spacing.md,
    },
    modalButton: {
        flex: 1,
        maxWidth: 160,
    },
});
