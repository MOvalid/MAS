import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { AppModal } from '@/components/common/AppModal';
import { AppTable, TableColumn } from '@/components/common/table';
import { metrics } from '@/theme/metrics';
import { formatAddressMultiline, formatPolishDate } from '@/utils/formatters';

import { PaymentDto, DeliveryDto } from '@/types/dto';
import {
    ORDER_STATUS_LABELS,
    OrderStatus,
    PAYMENT_SUMMARY_LABELS,
    PaymentMethod,
    PaymentSummaryStatus,
} from '@/types/common';
import { OrderItemTableData, PaymentTableData } from '@/types/domain';
import { formatPrice } from '@/utils/price-utils';
import { AddEditDeliveryForm, AddEditPaymentForm } from '@/components/form';
import { useOrderPaymentSummary } from '@/hooks/useOrderPaymentSummary';
import { getPaymentStatusColor } from '@/utils/color-utils';
import { useSnackbar } from '@/context/SnackbarContext';
import { useOrder } from '@/composables/orders/useOrders';
import { ErrorScreen } from '../ErrorScreen';
import { usePaymentTableData } from '@/composables/payment/usePayments';
import { useOrderItemTableData } from '@/composables/orders/useOrderItems';
import { LoadingScreen } from '../LoadingScreen';

export const OrderDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };

    const { showSnackbar } = useSnackbar();
    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDto | null>(null);

    const { data: order, loading, error, refresh } = useOrder(id);

    const orderItemsColumns: TableColumn<OrderItemTableData>[] = [
        { key: 'product', title: 'Produkt', flex: 2 },
        { key: 'quantity', title: 'Ilość', align: 'center', flex: 0.5 },
        { key: 'unit', title: 'Jdn.', align: 'right', flex: 0.5 },
        { key: 'unitPrice', title: 'Cena netto', align: 'right', flex: 0.75 },
        { key: 'netPrice', title: 'Kwota netto', align: 'right', flex: 0.75 },
        { key: 'vat', title: 'Kwota VAT', align: 'right', flex: 0.75 },
        { key: 'vatRate', title: 'VAT', align: 'right', flex: 0.5 },
        { key: 'grossPrice', title: 'Kwota brutto', align: 'right', flex: 0.8 },
        { key: 'currency', title: 'Waluta', align: 'center', flex: 0.5 },
    ];

    const paymentColumns: TableColumn<PaymentTableData>[] = [
        { key: 'method', title: 'Metoda płatności', flex: 1.5 },
        { key: 'amount', title: 'Kwota', align: 'right', flex: 1 },
        { key: 'currency', title: 'Waluta', align: 'center', flex: 0.5 },
        { key: 'status', title: 'Status', align: 'center', flex: 0.5 },
        { key: 'paymentDate', title: 'Data płatności', align: 'center', flex: 0.75 },
    ];

    const addPayment = () => {
        setSelectedPayment(null);
        setPaymentModalVisible(true);
    };

    const editPayment = (row: PaymentTableData) => {
        const selectedPayment = order?.payments?.find((p) => p.id === row.id);
        if (!selectedPayment) return;
        setSelectedPayment(selectedPayment);
        setPaymentModalVisible(true);
    };

    const cancelPayment = (row: PaymentTableData) => showSnackbar('CANCEL PAYMENT', 'warning');

    const editDelivery = () => {
        if (!order?.delivery) return;
        setSelectedDelivery(order.delivery);
        setDeliveryModalVisible(true);
    };

    const onClosePaymentModal = () => {
        setPaymentModalVisible(false);
        setSelectedPayment(null);
    };

    const onCloseDeliveryModal = () => {
        setDeliveryModalVisible(false);
        setSelectedDelivery(null);
    };

    const handleDelete = () => {
        setDeleteModalVisible(false);
        navigation.goBack();
    };

    if (loading) return <LoadingScreen />;

    if (error || !order) {
        return (
            <ErrorScreen
                title="Nie udało się pobrać danych"
                message={error || 'Zamówienie nie zostało znalezione'}
                onRetry={refresh}
            />
        );
    }

    const { orderTotal, paymentsTotal, remainingAmount, status, isOverpaid } =
        useOrderPaymentSummary(order?.orderProducts, order.payments);

    const orderItemsData = useOrderItemTableData(order.orderProducts || []);
    const paymentsData = usePaymentTableData(order.payments || []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <AppText variant="headlineMedium">Zamówienie</AppText>

                    <AppText style={styles.subtitle}>ID: {order.id}</AppText>
                    <AppText style={styles.subtitle}>
                        Utworzono: {formatPolishDate(order.createdAt, false)}
                    </AppText>
                </View>

                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <AppButton
                            icon={IconName.download}
                            onPress={() => {
                                console.log('Generowanie faktury...');
                                showSnackbar('Generowanie faktury...');
                            }}
                        >
                            Pobierz fakturę
                        </AppButton>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <AppButton icon={IconName.edit} onPress={() => {}}>
                            Edytuj zamówienie
                        </AppButton>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <AppButton
                            icon={IconName.delete}
                            onPress={() => setDeleteModalVisible(true)}
                            buttonColor={theme.colors.error}
                        >
                            Usuń zamówienie
                        </AppButton>
                    </View>
                </View>
            </View>

            <AppCard>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Informacje podstawowe
                </AppText>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Status:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Klient:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.customer
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : '-'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Sprzedawca:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.seller.firstName} {order.seller.lastName}
                    </AppText>
                </View>
            </AppCard>

            <AppCard>
                <AppTable
                    title="Pozycje zamówienia"
                    columns={orderItemsColumns}
                    data={orderItemsData}
                />
            </AppCard>

            <AppCard>
                <View style={styles.headerRow}>
                    <AppText variant="titleLarge" style={{ marginBottom: metrics.spacing.lg }}>
                        Płatności
                    </AppText>

                    <View style={styles.buttonRow}>
                        <AppButton
                            icon={IconName.payment}
                            onPress={() => setPaymentModalVisible(true)}
                        >
                            Zarządzaj płatnościami
                        </AppButton>
                    </View>
                </View>
                <AppTable
                    columns={paymentColumns}
                    data={paymentsData}
                    actions={(row) => [
                        {
                            icon: IconName.edit,
                            onPress: () => editPayment(row),
                            tooltip: 'Edytuj płatność',
                        },
                        {
                            icon: IconName.cancel,
                            onPress: () => cancelPayment(row),
                            iconColor: 'red',
                            tooltip: 'Anuluj płatność',
                        },
                    ]}
                />
            </AppCard>

            <AppCard>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Podsumowanie płatności
                </AppText>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Status:
                    </AppText>
                    <AppText
                        variant="bodyLarge"
                        style={[
                            styles.value,
                            { color: getPaymentStatusColor(status as PaymentSummaryStatus, theme) },
                        ]}
                    >
                        {PAYMENT_SUMMARY_LABELS[status as PaymentSummaryStatus]}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Suma zamówienia:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {formatPrice(orderTotal)} PLN
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Suma wpłat:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {formatPrice(paymentsTotal)} PLN
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        {isOverpaid ? 'Nadpłata:' : 'Pozostało do zapłaty:'}
                    </AppText>
                    <AppText
                        variant="bodyLarge"
                        style={[styles.value, isOverpaid && { color: theme.colors.error }]}
                    >
                        {formatPrice(Math.abs(remainingAmount))} PLN
                    </AppText>
                </View>

                {isOverpaid && (
                    <AppText
                        variant="bodySmall"
                        style={{ color: theme.colors.error, marginTop: metrics.spacing.sm }}
                    >
                        ⚠️ Wykryto nadpłatę – sprawdź poprawność wpłat
                    </AppText>
                )}
            </AppCard>

            <AppCard>
                <View style={styles.headerRow}>
                    <AppText variant="titleLarge" style={{ marginBottom: metrics.spacing.lg }}>
                        Dostawa
                    </AppText>

                    <View style={styles.buttonRow}>
                        <AppButton icon={IconName.delivery} onPress={editDelivery}>
                            Zarządzaj dostawą
                        </AppButton>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        ID:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.delivery?.id}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Data dostawy:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.delivery?.deliveryDate
                            ? formatPolishDate(order.delivery.deliveryDate, false)
                            : '-'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Adres dostawy:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {formatAddressMultiline(order.delivery?.address)}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Numer przesyłki:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.delivery?.trackingNumber}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Przewoźnik:{' '}
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {order.delivery?.carrierId}
                    </AppText>
                </View>
            </AppCard>

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń zamówienie
                </AppText>
                <AppText variant="bodyLarge" style={styles.modalText}>
                    Czy na pewno chcesz usunąć to zamówienie?
                </AppText>

                <View style={styles.modalButtons}>
                    <AppButton mode="outlined" onPress={() => setDeleteModalVisible(false)}>
                        Anuluj
                    </AppButton>
                    <AppButton
                        mode="contained"
                        buttonColor={theme.colors.error}
                        onPress={handleDelete}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
            <AppModal visible={paymentModalVisible} onClose={onClosePaymentModal}>
                <AddEditPaymentForm
                    initialAmount={selectedPayment?.amount}
                    initialCurrency={selectedPayment?.currency ?? 'PLN'}
                    initialMethod={(selectedPayment?.paymentMethod as PaymentMethod) ?? undefined}
                    onClose={() => setPaymentModalVisible(false)}
                    onSave={(amount, currency, method) => {
                        console.log('Zapisano płatność:', { amount, currency, method });
                        setPaymentModalVisible(false);
                    }}
                />
            </AppModal>

            <AppModal visible={deliveryModalVisible} onClose={onCloseDeliveryModal}>
                <AddEditDeliveryForm
                    initialAddress={selectedDelivery?.address}
                    initialCarrier={selectedDelivery?.carrierId ?? ''}
                    initialTracking={selectedDelivery?.trackingNumber ?? ''}
                    onClose={onCloseDeliveryModal}
                    onSave={(addr, carrier, tracking) => {
                        console.log('Zapisano dostawę:', { addr, carrier, tracking });
                        setDeliveryModalVisible(false);
                        setSelectedDelivery(null);
                    }}
                />
            </AppModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: metrics.spacing.lg,
        gap: metrics.spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
    },
    buttonWrapper: {
        flexGrow: 1,
        minWidth: 180,
        alignItems: 'stretch',
    },
    cardTitle: {
        marginBottom: metrics.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: metrics.spacing.sm,
    },
    label: {
        width: 200,
        fontWeight: metrics.fontWeight.semibold,
    },
    value: {
        flex: 1,
    },
    modalTitle: {
        marginBottom: metrics.spacing.md,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: metrics.spacing.lg,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: metrics.spacing.md,
    },
});
