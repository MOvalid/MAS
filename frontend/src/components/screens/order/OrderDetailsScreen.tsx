import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName, InfoItem } from '@/components/common';
import { AppModal } from '@/components/common/AppModal';
import { AppTable, TableColumn } from '@/components/common/table';
import { metrics } from '@/theme/metrics';
import { formatAddressMultiline, formatPolishDate } from '@/utils/formatters';
import { PaymentDto } from '@/types/dto';
import {
    PAYMENT_SUMMARY_LABELS,
    PaymentMethod,
    PaymentSummaryStatus,
    ORDER_STATUS_LABELS,
    OrderStatus,
    PaymentStatus,
} from '@/types/common';
import { Address, Delivery, OrderItemTableData, PaymentTableData } from '@/types/domain';
import { formatPrice } from '@/utils/price-utils';
import { AddEditDeliveryForm, AddEditPaymentForm } from '@/components/form';
import { useOrderPaymentSummary } from '@/hooks/useOrderPaymentSummary';
import { getPaymentStatusColor } from '@/utils/color-utils';
import { useOrder } from '@/composables/orders/useOrders';
import { ErrorScreen } from '../ErrorScreen';
import { usePaymentTableData } from '@/composables/payment/usePayments';
import { useOrderItemTableData } from '@/composables/orders/useOrderItems';
import { LoadingScreen } from '../LoadingScreen';
import { useOrderActions } from '@/hooks/useOrderActions';
import { useCarrierOptions } from '@/composables/carrier/useCarriers';
import { useSnackbar } from '@/context/SnackbarContext';
import { useGenerateInvoicePdf } from '@/composables/invoice/useInvoices';

const ITEMS_PER_PAGE = 10;

export const OrderDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();
    const { showSnackbar } = useSnackbar();
    const params = route.params as { id?: string } | undefined;
    const id = params?.id || '';

    const [isWaitingForInvoice, setIsWaitingForInvoice] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
    const [visibleProductsCount, setVisibleProductsCount] = useState(ITEMS_PER_PAGE);
    const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
    const [, setSelectedDelivery] = useState<Delivery | null>(null);

    const { data: order, loading: orderLoading, error, refresh } = useOrder(id);
    const { data: carriers } = useCarrierOptions(true, { name: '' });

    const {
        handleSavePayment,
        handleCancelPayment,
        handleSaveDelivery,
        handleCreateInvoice,
        handleCancelOrder,
        handleReturnOrder,
        isLoading,
    } = useOrderActions(id, '', refresh, order?.payments || []);

    const { generatePdf, isGenerating: isDownloading } = useGenerateInvoicePdf(
        () => showSnackbar('Faktura została pobrana', 'success'),
        (err) => showSnackbar(err, 'error')
    );

    useEffect(() => {
        if (isWaitingForInvoice && order?.invoice?.id) {
            generatePdf(order.invoice.id, order.invoice.invoiceNumber);
            setIsWaitingForInvoice(false);
        }
    }, [order?.invoice, isWaitingForInvoice]);

    const { orderTotal, paymentsTotal, remainingAmount, isOverpaid } = useOrderPaymentSummary(
        order?.orderProducts || [],
        order?.payments || []
    );

    const orderItemsData = useOrderItemTableData(order?.orderProducts || []);
    const paymentsData = usePaymentTableData(order?.payments || []);
    const carrierName = useMemo(() => {
        if (!order?.delivery?.carrierId || !carriers) return '-';
        const carrier = carriers.find((c) => c.id === order.delivery?.carrierId);
        return carrier ? carrier.name : order.delivery.carrierId;
    }, [order?.delivery?.carrierId, carriers]);

    const paginatedProducts = useMemo(() => {
        return orderItemsData.slice(0, visibleProductsCount);
    }, [orderItemsData, visibleProductsCount]);

    const hasMoreProducts = orderItemsData.length > visibleProductsCount;

    const handleLoadMore = () => {
        setVisibleProductsCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const loading = orderLoading || isLoading || false;

    const orderItemsColumns: TableColumn<OrderItemTableData>[] = useMemo(
        () => [
            { key: 'product', title: 'Produkt', flex: 3 },
            { key: 'quantity', title: 'Ilość', align: 'center', flex: 0.25 },
            { key: 'unit', title: 'Jdn.', align: 'right', flex: 0.25 },
            { key: 'unitPrice', title: 'Cena netto', align: 'right', flex: 0.5 },
            { key: 'grossPrice', title: 'Kwota brutto', align: 'right', flex: 0.5 },
        ],
        []
    );

    const paymentColumns: TableColumn<PaymentTableData>[] = useMemo(
        () => [
            { key: 'method', title: 'Metoda', flex: 1.5 },
            { key: 'amount', title: 'Kwota', align: 'right', flex: 1 },
            { key: 'currency', title: 'Waluta', align: 'center', flex: 0.5 },
            { key: 'statusLabel', title: 'Status', align: 'center', flex: 0.5 },
            { key: 'paymentDate', title: 'Data', align: 'center', flex: 0.75 },
        ],
        []
    );

    const onEditPayment = (row: PaymentTableData) => {
        const payment = order?.payments?.find((p) => p.id === row.id);
        if (payment) {
            setSelectedPayment(payment);
            setPaymentModalVisible(true);
        }
    };

    const onDownloadInvoice = () => {
        if (order?.invoice?.id) {
            generatePdf(order.invoice.id, order.invoice.invoiceNumber);
        } else {
            showSnackbar('Brak danych faktury', 'error');
        }
    };

    const onSavePayment = (amount: number, currency: string, method: PaymentMethod) => {
        handleSavePayment(amount, currency, method, selectedPayment?.id);
        setPaymentModalVisible(false);
        setSelectedPayment(null);
    };

    const onSaveDelivery = (address: Address, carrier: string, tracking: string, date: string) => {
        handleSaveDelivery(address, carrier, tracking, date, order?.delivery?.id);
        setDeliveryModalVisible(false);
    };

    const onAddPayment = () => {
        setSelectedPayment(null);
        setPaymentModalVisible(true);
    };

    const onCreateInvoicePress = async () => {
        try {
            await handleCreateInvoice();
            setIsWaitingForInvoice(true);
            await refresh();
        } catch (err) {
            showSnackbar('Błąd podczas tworzenia faktury', 'error');
        }
    };

    if (loading && !order) return <LoadingScreen />;
    if (error || !order)
        return (
            <ErrorScreen
                title="Błąd pobierania"
                message={error || 'Nie znaleziono zamówienia'}
                onRetry={refresh}
            />
        );

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
            scrollEventThrottle={16}
        >
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <AppText variant="headlineMedium">Zamówienie</AppText>
                    <AppText style={styles.subtitle}>ID: {order.id}</AppText>
                    <AppText style={styles.subtitle}>
                        Utworzono: {formatPolishDate(order.createdAt, false)}
                    </AppText>
                </View>

                <View style={styles.buttonRow}>
                    {!order.invoice ? (
                        <AppButton
                            icon={IconName.invoice}
                            mode="outlined"
                            onPress={onCreateInvoicePress}
                            loading={isLoading}
                            style={styles.flexButton}
                        >
                            Faktura
                        </AppButton>
                    ) : (
                        <AppButton
                            icon={IconName.download}
                            mode="outlined"
                            onPress={onDownloadInvoice}
                            loading={isDownloading}
                            style={styles.flexButton}
                        >
                            Faktura
                        </AppButton>
                    )}

                    <AppButton
                        icon={IconName.edit}
                        mode="contained"
                        onPress={() => navigation.navigate('OrderEdit', { id: order.id })}
                        style={styles.flexButton}
                    >
                        Edytuj
                    </AppButton>

                    {(order.status === OrderStatus.DRAFT ||
                        order.status === OrderStatus.PAYMENT_PENDING) && (
                        <AppButton
                            icon={IconName.cancel}
                            buttonColor={theme.colors.error}
                            onPress={() => setDeleteModalVisible(true)}
                            loading={isLoading}
                            style={styles.flexButton}
                        >
                            Anuluj
                        </AppButton>
                    )}

                    {order.status === OrderStatus.DELIVERED && (
                        <AppButton
                            icon={IconName.refresh}
                            mode="contained"
                            buttonColor={theme.colors.secondary}
                            onPress={handleReturnOrder}
                            loading={isLoading}
                            style={styles.flexButton}
                        >
                            Zwrot
                        </AppButton>
                    )}
                </View>
            </View>

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Informacje podstawowe
                </AppText>
                <InfoItem
                    label="Status"
                    value={ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                />
                <InfoItem
                    label="Klient"
                    value={
                        order.customer
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : '-'
                    }
                />
                <InfoItem
                    label="Sprzedawca"
                    value={`${order.seller.firstName} ${order.seller.lastName}`}
                />
            </AppCard>

            <AppCard>
                <AppTable
                    title="Pozycje zamówienia"
                    columns={orderItemsColumns}
                    data={paginatedProducts}
                />
                {hasMoreProducts && (
                    <View style={styles.loadMoreContainer}>
                        <AppButton mode="text" icon={IconName.chevronDown} onPress={handleLoadMore}>
                            Rozwiń kolejne{' '}
                            {Math.min(ITEMS_PER_PAGE, orderItemsData.length - visibleProductsCount)}{' '}
                            pozycji
                        </AppButton>
                        <AppText style={styles.paginationHint}>
                            Wyświetlono {visibleProductsCount} z {orderItemsData.length}
                        </AppText>
                    </View>
                )}

                {!hasMoreProducts && orderItemsData.length > ITEMS_PER_PAGE && (
                    <View style={styles.loadMoreContainer}>
                        <AppButton
                            mode="text"
                            onPress={() => setVisibleProductsCount(ITEMS_PER_PAGE)}
                        >
                            Zwiń listę
                        </AppButton>
                    </View>
                )}
            </AppCard>

            <AppCard>
                <View style={styles.cardHeaderWithButton}>
                    <AppText variant="titleLarge">Płatności</AppText>
                    <AppButton
                        icon={IconName.payment}
                        onPress={onAddPayment}
                        style={styles.actionButtonWidth}
                    >
                        Dodaj płatność
                    </AppButton>
                </View>
                <AppTable
                    columns={paymentColumns}
                    data={paymentsData}
                    actions={(row) => {
                        const canAction = row.status === PaymentStatus.PENDING;

                        return [
                            {
                                icon: IconName.edit,
                                iconColor: canAction ? theme.colors.primary : 'transparent',
                                onPress: () => canAction && onEditPayment(row),
                                disabled: !canAction,
                            },
                            {
                                icon: IconName.cancel,
                                iconColor: canAction ? theme.colors.error : 'transparent',
                                onPress: () => canAction && handleCancelPayment(row.id),
                                disabled: !canAction,
                            },
                        ];
                    }}
                />
            </AppCard>

            <AppCard>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Podsumowanie płatności
                </AppText>
                <InfoItem label="Suma zamówienia" value={`${formatPrice(orderTotal)} PLN`} />
                <InfoItem label="Suma wpłat" value={`${formatPrice(paymentsTotal)} PLN`} />
                <InfoItem
                    label={isOverpaid ? 'Nadpłata' : 'Pozostało do zapłaty'}
                    value={`${formatPrice(Math.abs(remainingAmount))} PLN`}
                    valueStyle={isOverpaid ? { color: theme.colors.error } : {}}
                />
            </AppCard>

            <AppCard>
                <View style={styles.cardHeaderWithButton}>
                    <AppText variant="titleLarge">Dostawa</AppText>
                    <AppButton
                        icon={IconName.delivery}
                        onPress={() => {
                            setSelectedDelivery(order.delivery);
                            setDeliveryModalVisible(true);
                        }}
                        style={styles.actionButtonWidth}
                    >
                        Zarządzaj
                    </AppButton>
                </View>
                <InfoItem label="Adres" value={formatAddressMultiline(order.delivery?.address)} />
                <InfoItem label="Opcja dostawy" value={carrierName} />
                <InfoItem label="Numer przesyłki" value={order.delivery?.trackingNumber || '-'} />
                <InfoItem
                    label="Data dostawy"
                    value={
                        order.delivery?.deliveryDate
                            ? formatPolishDate(order.delivery?.deliveryDate, false)
                            : '-'
                    }
                />
            </AppCard>

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Anuluj zamówienie
                </AppText>
                <AppText style={styles.modalText}>
                    Czy na pewno chcesz anulować to zamówienie?
                </AppText>
                <View style={styles.modalButtonsRow}>
                    <AppButton
                        mode="outlined"
                        onPress={() => setDeleteModalVisible(false)}
                        style={styles.flexButton}
                    >
                        Wróć
                    </AppButton>
                    <AppButton
                        buttonColor={theme.colors.error}
                        style={styles.flexButton}
                        onPress={() => {
                            handleCancelOrder();
                            setDeleteModalVisible(false);
                        }}
                    >
                        Anuluj
                    </AppButton>
                </View>
            </AppModal>

            <AppModal
                visible={paymentModalVisible}
                onClose={() => {
                    setPaymentModalVisible(false);
                    setSelectedPayment(null);
                }}
            >
                <AddEditPaymentForm
                    initialAmount={selectedPayment?.amount}
                    initialCurrency={selectedPayment?.currency ?? 'PLN'}
                    initialMethod={(selectedPayment?.paymentMethod as PaymentMethod) ?? undefined}
                    onClose={() => setPaymentModalVisible(false)}
                    onSave={onSavePayment}
                />
            </AppModal>

            <AppModal
                visible={deliveryModalVisible}
                onClose={() => {
                    setDeliveryModalVisible(false);
                    setSelectedDelivery(null);
                }}
            >
                <AddEditDeliveryForm
                    initialAddress={order.delivery?.address}
                    initialCarrierId={order.delivery?.carrierId ?? ''}
                    initialTracking={order.delivery?.trackingNumber ?? ''}
                    initialDeliveryDate={order.delivery?.deliveryDate ?? ''}
                    onClose={() => setDeliveryModalVisible(false)}
                    onSave={onSaveDelivery}
                />
            </AppModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: { padding: metrics.spacing.lg, gap: metrics.spacing.lg },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: metrics.spacing.lg,
        gap: metrics.spacing.md,
    },
    subtitle: { color: '#666', fontSize: 12 },
    buttonRow: {
        flexDirection: 'row',
        gap: metrics.spacing.sm,
        flex: 2,
        justifyContent: 'flex-end',
    },
    flexButton: {
        flex: 1,
        minWidth: 100,
        maxWidth: 150,
    },
    cardTitle: { marginBottom: metrics.spacing.md },
    cardHeaderWithButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: metrics.spacing.lg,
    },
    actionButtonWidth: {
        minWidth: 160,
    },
    modalTitle: { textAlign: 'center', marginBottom: metrics.spacing.md },
    modalText: { textAlign: 'center', marginBottom: metrics.spacing.lg },
    modalButtonsRow: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
        width: '100%',
        justifyContent: 'center',
    },
    container: { flex: 1 },
    card: { marginBottom: metrics.spacing.lg },
    infoRow: { flexDirection: 'row', marginBottom: metrics.spacing.xs },
    label: { flex: 1, fontWeight: metrics.fontWeight.semibold, color: '#444' },
    value: { flex: 3 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: metrics.spacing.md },
    loadMoreContainer: {
        paddingVertical: metrics.spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: metrics.spacing.xs,
    },
    paginationHint: {
        fontSize: 12,
        color: '#888',
        marginTop: metrics.spacing.xs,
    },
});
