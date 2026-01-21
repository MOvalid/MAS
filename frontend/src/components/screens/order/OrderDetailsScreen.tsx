import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName, InfoItem } from '@/components/common';
import { AppModal } from '@/components/common/AppModal';
import { AppTable, TableColumn } from '@/components/common/table';
import { metrics } from '@/theme/metrics';
import { formatAddressMultiline, formatPolishDate } from '@/utils/formatters';
import { PaymentDto, DeliveryDto } from '@/types/dto';
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

export const OrderDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();
    const { id } = route.params as { id: string };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

    const { data: order, loading, error, refresh } = useOrder(id);
    const { data: carriers } = useCarrierOptions(true, { name: '' });

    const { handleSavePayment, handleCancelPayment, handleSaveDelivery } = useOrderActions(
        id,
        refresh,
        order?.payments || []
    );

    const { orderTotal, paymentsTotal, remainingAmount, status, isOverpaid } =
        useOrderPaymentSummary(order?.orderProducts || [], order?.payments || []);

    const orderItemsData = useOrderItemTableData(order?.orderProducts || []);
    const paymentsData = usePaymentTableData(order?.payments || []);
    const carrierName = useMemo(() => {
        if (!order?.delivery?.carrierId || !carriers) return '-';
        const carrier = carriers.find((c) => c.id === order.delivery?.carrierId);
        return carrier ? carrier.name : order.delivery.carrierId;
    }, [order?.delivery?.carrierId, carriers]);

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

    const onSavePayment = (amount: number, currency: string, method: PaymentMethod) => {
        handleSavePayment(amount, currency, method, selectedPayment?.id);
        setPaymentModalVisible(false);
        setSelectedPayment(null);
    };

    const onSaveDelivery = (address: Address, carrier: string, tracking: string, date: string) => {
        handleSaveDelivery(address, carrier, tracking, date);
        setDeliveryModalVisible(false);
    };

    const onAddPayment = () => {
        setSelectedPayment(null);
        setPaymentModalVisible(true);
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
            {/* Nagłówek i Akcje Główne */}
            <View style={styles.headerRow}>
                <View>
                    <AppText variant="headlineMedium">Zamówienie</AppText>
                    <AppText style={styles.subtitle}>ID: {order.id}</AppText>
                    <AppText style={styles.subtitle}>
                        Utworzono: {formatPolishDate(order.createdAt, false)}
                    </AppText>
                </View>
                <View style={styles.buttonRow}>
                    <AppButton
                        icon={IconName.edit}
                        mode="contained"
                        onPress={() => {
                            navigation.navigate('OrderEdit', { id: order.id });
                        }}
                    >
                        Edytuj
                    </AppButton>
                    <AppButton
                        icon={IconName.delete}
                        buttonColor={theme.colors.error}
                        onPress={() => setDeleteModalVisible(true)}
                    >
                        Usuń
                    </AppButton>
                </View>
            </View>

            <AppCard>
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
                    data={orderItemsData}
                />
            </AppCard>

            <AppCard>
                <View style={styles.cardHeaderWithButton}>
                    <AppText variant="titleLarge">Płatności</AppText>
                    <AppButton icon={IconName.payment} onPress={onAddPayment}>
                        Dodaj płatność
                    </AppButton>
                </View>
                <AppTable
                    columns={paymentColumns}
                    data={paymentsData}
                    actions={(row) => {
                        const isCompleted = row.status === PaymentStatus.COMPLETED;

                        return [
                            {
                                icon: IconName.edit,
                                iconColor: isCompleted ? 'transparent' : theme.colors.primary,
                                onPress: () => !isCompleted && onEditPayment(row),
                                disabled: isCompleted,
                            },
                            {
                                icon: IconName.cancel,
                                iconColor: isCompleted ? 'transparent' : theme.colors.error,
                                onPress: () => !isCompleted && handleCancelPayment(row.id),
                                disabled: isCompleted,
                            },
                        ];
                    }}
                />
            </AppCard>

            <AppCard>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Podsumowanie płatności
                </AppText>
                <InfoItem
                    label="Status"
                    value={PAYMENT_SUMMARY_LABELS[status as PaymentSummaryStatus]}
                    valueStyle={{
                        color: getPaymentStatusColor(status as PaymentSummaryStatus, theme),
                    }}
                />
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
                    >
                        Zarządzaj
                    </AppButton>
                </View>
                <InfoItem label="Adres" value={formatAddressMultiline(order.delivery?.address)} />
                <InfoItem label="Opcja dostawy" value={carrierName} />
                <InfoItem label="Numer przesyłki" value={order.delivery?.trackingNumber || '-'} />
            </AppCard>

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
                    <AppButton buttonColor={theme.colors.error} onPress={() => navigation.goBack()}>
                        Usuń
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

            <AppModal visible={deliveryModalVisible} onClose={() => setDeliveryModalVisible(false)}>
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
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    contentContainer: { padding: metrics.spacing.lg, gap: metrics.spacing.lg },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: metrics.spacing.md,
    },
    subtitle: { color: '#666' },
    buttonRow: { flexDirection: 'row', gap: metrics.spacing.md },
    cardTitle: { marginBottom: metrics.spacing.md },
    cardHeaderWithButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: metrics.spacing.lg,
    },
    infoRow: { flexDirection: 'row', marginBottom: metrics.spacing.xs },
    label: { flex: 1, fontWeight: metrics.fontWeight.semibold, color: '#444' },
    value: { flex: 3 },
    modalTitle: { textAlign: 'center', marginBottom: metrics.spacing.md },
    modalText: { textAlign: 'center', marginBottom: metrics.spacing.lg },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: metrics.spacing.md },
});
