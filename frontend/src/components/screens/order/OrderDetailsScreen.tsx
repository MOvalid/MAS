import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { AppModal } from '@/components/common/AppModal';
import { AppTable, TableColumn } from '@/components/common/table';
import { metrics } from '@/theme/metrics';
import { formatAddressMultiline, formatPolishDate } from '@/utils/formatters';

import { OrderSummaryDto, PaymentDto, OrderItemDto } from '@/types/dto';
import {
    PAYMENT_STATUS_LABELS,
    ORDER_STATUS_LABELS,
    OrderStatus,
    PaymentStatus,
    PaymentMethod,
    PAYMENT_METHOD_LABELS,
    PAYMENT_SUMMARY_LABELS,
    PaymentSummaryStatus,
} from '@/types/common';
import { OrderItemTableRow, PaymentTableRow } from '@/types/domain';
import { formatPrice } from '@/utils/price-utils';
import { AddEditDeliveryForm, AddEditPaymentForm } from '@/components/form';
import { useOrderPaymentSummary } from '@/hooks/useOrderPaymentSummary';
import { getPaymentStatusColor } from '@/utils/color-utils';
import { useSnackbar } from '@/context/SnackbarContext';

const mockOrder: OrderSummaryDto = {
    id: 'order-123',
    createdAt: '2025-02-10T09:30:00Z',
    status: 'PROCESSING',
    customer: {
        id: 'cust-1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '123456789',
        address: null,
        orders: null,
    },
    company: null,
    seller: {
        id: 'seller-1',
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@example.com',
        orders: null,
    },
    delivery: {
        id: 'Del-123', // UUID
        orderId: 'order-123',
        deliveryDate: '2025-02-13T12:09:00Z', // ISO datetime
        address: {
            street: 'ul. Wrocławska',
            number: '7A',
            city: 'Wrocław',
            postalCode: '50-331',
            country: 'Polska',
        },
        trackingNumber: '123456789',
        carrier: 'DHL',
    },
    invoice: null,
    orderItems: [
        {
            orderId: 'order-123',
            product: { id: 'prod-1', name: 'Laptop Pro 15' },
            quantity: 1,
            unitPrice: 4000,
            netPrice: 4000,
            vatRate: 23,
            vatAmount: 920,
            grossPrice: 4920,
            currency: 'PLN',
        },
        {
            orderId: 'order-123',
            product: { id: 'prod-2', name: 'Mysz bezprzewodowa' },
            quantity: 2,
            unitPrice: 100,
            netPrice: 200,
            vatRate: 23,
            vatAmount: 46,
            grossPrice: 246,
            currency: 'PLN',
        },
    ],
    payments: [
        {
            id: 'pay-1',
            orderId: 'order-123',
            invoiceId: null,
            amount: 5166,
            currency: 'PLN',
            paymentMethod: 'BANK_TRANSFER',
            status: 'COMPLETED',
            paidAt: '2025-02-11T10:15:00Z',
        },
    ],
};

export const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

    const order = mockOrder;

    const orderItemsData: OrderItemTableRow[] = useMemo(
        () =>
            order.orderItems?.map((item: OrderItemDto) => ({
                product: item.product.name,
                quantity: item.quantity,
                unitPrice: formatPrice(item.unitPrice),
                netPrice: formatPrice(item.netPrice),
                unit: 'szt.',
                vat: `${formatPrice(item.vatAmount)}`,
                vatRate: `${item.vatRate}%`,
                grossPrice: formatPrice(item.grossPrice),
                currency: item.currency,
            })) ?? [],
        [order.orderItems]
    );

    const paymentsData: PaymentTableRow[] = useMemo(
        () =>
            order.payments?.map((p: PaymentDto) => ({
                id: p.id,
                method: PAYMENT_METHOD_LABELS[p.paymentMethod as PaymentMethod] ?? p.paymentMethod,
                amount: formatPrice(p.amount),
                status: PAYMENT_STATUS_LABELS[p.status as PaymentStatus] ?? p.status,
                paidAt: p.paidAt ? formatPolishDate(p.paidAt, false) : '-',
                currency: p.currency,
            })) ?? [],
        [order.payments]
    );

    const orderItemsColumns: TableColumn<OrderItemTableRow>[] = [
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

    const paymentColumns: TableColumn<PaymentTableRow>[] = [
        { key: 'method', title: 'Metoda płatności', flex: 1.5 },
        { key: 'amount', title: 'Kwota', align: 'right', flex: 1 },
        { key: 'currency', title: 'Waluta', align: 'center', flex: 0.5 },
        { key: 'status', title: 'Status', align: 'center', flex: 0.5 },
        { key: 'paidAt', title: 'Data płatności', align: 'center', flex: 0.75 },
    ];

    const editPayment = (row: PaymentTableRow) => setPaymentModalVisible(true);
    const cancelPayment = (row: PaymentTableRow) => showSnackbar('CANCEL PAYMENT', 'warning');

    const handleDelete = () => {
        setDeleteModalVisible(false);
        navigation.goBack();
    };

    const { orderTotal, paymentsTotal, remainingAmount, status, isOverpaid } =
        useOrderPaymentSummary(order.orderItems, order.payments);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <AppText variant="headlineMedium">Zamówienie #{order.id}</AppText>
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
                        <AppButton icon={IconName.edit} onPress={() => { }}>
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
                        <AppButton
                            icon={IconName.delivery}
                            onPress={() => setDeliveryModalVisible(true)}
                        >
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
                        {order.delivery?.carrier}
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
            <AppModal visible={paymentModalVisible} onClose={() => setPaymentModalVisible(false)}>
                <AddEditPaymentForm
                    onClose={() => setPaymentModalVisible(false)}
                    onSave={(payment) => {
                        console.log('Nowa płatność:', payment);
                        setPaymentModalVisible(false);
                    }}
                />
            </AppModal>

            <AppModal visible={deliveryModalVisible} onClose={() => setDeliveryModalVisible(false)}>
                <AddEditDeliveryForm
                    initialAddress={order.delivery?.address}
                    initialCarrier={order.delivery?.carrier ?? ''}
                    initialTracking={order.delivery?.trackingNumber ?? ''}
                    onClose={() => setDeliveryModalVisible(false)}
                    onSave={(addr, carrier, tracking) => {
                        console.log('Aktualizacja dostawy:', { addr, carrier, tracking });
                        setDeliveryModalVisible(false);
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
