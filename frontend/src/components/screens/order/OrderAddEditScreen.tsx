import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName, InfoItem } from '@/components/common';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';
import {
    OrderProductInputCard,
    ProductOption,
} from '@/components/common/order/OrderProductInputCard';
import { OrderProductList } from '@/components/common/order/OrderProductList';
import { AppModal } from '@/components/common/AppModal';
import { metrics } from '@/theme/metrics';
import { Currency, Option, PaymentStatus, PersonBase } from '@/types/common';
import { Delivery, OrderItem, PaymentTableData } from '@/types/domain';
import { useCreateOrder, useOrder, useUpdateOrder } from '@/composables/orders/useOrders';
import { useCustomerOptions } from '@/composables/customer/useCustomers';
import { CreateOrderItem, CreateOrderPayload, PaymentDto } from '@/types/dto';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorMessage } from '@/components/common/AppStageMessage';
import { useSellerOptions } from '@/composables/seller/useSellers';
import { useProductOptions } from '@/composables/product/useProducts';
import { formatAddressMultiline, formatPolishDate } from '@/utils/formatters';
import { TableColumn, AppTable } from '@/components/common/table';
import { useOrderItemTableData } from '@/composables/orders/useOrderItems';
import { usePaymentTableData } from '@/composables/payment/usePayments';
import { useOrderActions } from '@/hooks/useOrderActions';
import { useCarrierOptions } from '@/composables/carrier/useCarriers';

const AddPaymentForm = ({ onClose }: { onClose: () => void }) => (
    <View>
        <AppText variant="titleLarge">Dodaj płatność</AppText>
        <AppButton onPress={onClose}>Zamknij</AppButton>
    </View>
);

const AddDeliveryForm = ({ onClose }: { onClose: () => void }) => (
    <View>
        <AppText variant="titleLarge">Dodaj dostawę</AppText>
        <AppButton onPress={onClose}>Zamknij</AppButton>
    </View>
);

export const OrderAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params;
    const isEdit = Boolean(id);
    const { data: order, error: fetchOrderError, loading: orderLoading, refresh } = useOrder(id);

    const { create, loading: createLoading } = useCreateOrder((newOrder) => {
        navigation.replace('OrderDetails', { id: newOrder.id });
    });
    const { update, loading: updateLoading } = useUpdateOrder((updatedOrder) => {
        navigation.replace('OrderDetails', { id: updatedOrder.id });
    });

    const { handleSavePayment, handleCancelPayment, handleSaveDelivery } = useOrderActions(
        id,
        refresh,
        order?.payments || []
    );

    const orderItemsData = useOrderItemTableData(order?.orderProducts || []);
    const paymentsData = usePaymentTableData(order?.payments || []);

    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchSeller, setSearchSeller] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const {
        data: customersData,
        loading: customersLoading,
        setFilters: setCustomerFilters,
    } = useCustomerOptions(true, { name: '' });

    const {
        data: sellersData,
        loading: sellersLoading,
        setFilters: setSellerFilters,
    } = useSellerOptions(true, { name: '' });

    const { data: carrierData, loading: carrierLoading } = useCarrierOptions(true);

    const {
        data: productsData,
        loading: productsLoading,
        setFilters: setProductFilters,
    } = useProductOptions(true, { name: '', limit: 10 });

    const handleCustomerSearchChange = (search: string) => {
        setSearchCustomer(search);
        setCustomerFilters({ name: search });
    };

    const handleSellerSearchChange = (search: string) => {
        setSearchSeller(search);
        setSellerFilters({ name: search });
    };

    const handleProductSearchChange = (search: string) => {
        setSearchProduct(search);
        setProductFilters({ name: search, limit: 10 });
    };

    const loading = orderLoading || customersLoading || sellersLoading || carrierLoading || false;

    const [customerValue, setCustomerValue] = useState<Option | undefined>(undefined);
    const [sellerValue, setSellerValue] = useState<Option | undefined>(undefined);
    const [orderProducts, setOrderProducts] = useState<OrderItem[]>([]);
    const [errors, setErrors] = useState<{ customer?: string; seller?: string }>({});

    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

    const formatPersonLabel = (
        person: PersonBase | undefined | null,
        fallback: string
    ): Option | undefined => {
        if (!person) return undefined;
        const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ');
        return {
            label: fullName || fallback,
            value: person.id,
        };
    };

    useEffect(() => {
        if (!isEdit || !order) return;

        setOrderProducts(order.orderProducts || []);

        const customerOpt = formatPersonLabel(order.customer, 'Klient');
        if (customerOpt) setCustomerValue(customerOpt);

        const sellerOpt = formatPersonLabel(order.seller, 'Sprzedawca');
        if (sellerOpt) setSellerValue(sellerOpt);
    }, [order, isEdit]);

    const customerOptions = useMemo(
        () => customersData.map((s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id })),
        [customersData]
    );

    const sellerOptions = useMemo(
        () => sellersData.map((s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id })),
        [sellersData]
    );

    const productOptions: ProductOption[] = useMemo(
        () => productsData.map((s) => ({ label: s.name, value: s.id, unitPrice: s.netPrice })),
        [productsData]
    );

    const validate = (): boolean => {
        const e: { customer?: string; seller?: string } = {};
        if (!customerValue) e.customer = 'Wybierz klienta';
        if (!sellerValue) e.seller = 'Wybierz sprzedającego';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

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

    const handleSave = async () => {
        if (!validate()) return;

        const payload: CreateOrderPayload = {
            customerId: customerValue!.value,
            sellerId: sellerValue!.value,
            currency: Currency.PLN,
            orderProducts: orderProducts.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
            })),
        };

        if (isEdit) {
            // Logika aktualizacji jeśli API na to pozwala
        } else {
            await create(payload);
        }
    };

    const handleAddProduct = (item: CreateOrderItem) => {
        if (isEdit) return; // Dodatkowe zabezpieczenie

        const productInfo = productsData.find((p) => p.id === item.productId);
        if (productInfo) {
            const qty = item.quantity;
            const netPrice = productInfo.netPrice || 0;
            const vatRate = productInfo.vatRate || 23;

            const totalNet = netPrice * qty;
            const totalVat = totalNet * (vatRate / 100);
            const totalGross = totalNet + totalVat;

            const newItem: OrderItem = {
                productId: item.productId,
                product: productInfo,
                quantity: qty,
                unitNetPrice: netPrice,
                vatRate: vatRate,
                currency: Currency.PLN,
                totalNetPrice: totalNet,
                totalVatAmount: totalVat,
                totalGrossPrice: totalGross,
            };

            setOrderProducts((prev) => [...prev, newItem]);
        }
    };

    const handleRemoveProduct = (index: number) => {
        if (isEdit) return;
        setOrderProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const onEditPayment = (row: PaymentTableData) => {
        const payment = order?.payments?.find((p) => p.id === row.id);
        if (payment) {
            setSelectedPayment(payment);
            setPaymentModalVisible(true);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg },
        card: { backgroundColor: theme.colors.background, marginBottom: metrics.spacing.lg },
        cardTitle: { marginBottom: metrics.spacing.md },
        subtitle: { color: '#666' },
        modalTitle: { textAlign: 'center', marginBottom: metrics.spacing.md },
        modalText: { textAlign: 'center', marginBottom: metrics.spacing.lg },
        modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: metrics.spacing.md },
        cardHeaderWithButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: metrics.spacing.lg,
        },
        actionRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: metrics.spacing.md,
            marginVertical: metrics.spacing.lg,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: metrics.spacing.lg,
        },
        buttonRow: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        buttonWrapper: {
            flex: 1,
            alignItems: 'stretch',
        },
        button: { minWidth: 160 },
        hint: { color: theme.colors.onSurfaceVariant, marginTop: metrics.spacing.xs },
    });

    if (loading) return <LoadingScreen text="Ładowanie danych..." />;

    if (fetchOrderError || (!order && isEdit)) {
        return (
            <ErrorMessage
                error={fetchOrderError || 'Wystąpił błąd podczas ładowania danych'}
                onRetry={refresh}
                onBack={() => navigation.goBack()}
            />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <AppText variant="headlineMedium">Zamówienie</AppText>
                    {isEdit && (
                        <>
                            <AppText style={styles.subtitle}>ID: {id}</AppText>
                            <AppText style={styles.subtitle}>
                                Utworzono: {formatPolishDate(order?.createdAt, false)}
                            </AppText>
                        </>
                    )}
                </View>
                {isEdit && (
                    <View style={styles.buttonRow}>
                        <AppButton
                            icon={IconName.delete}
                            buttonColor={theme.colors.error}
                            onPress={() => setDeleteModalVisible(true)}
                        >
                            Usuń
                        </AppButton>
                    </View>
                )}
            </View>

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Informacje podstawowe
                </AppText>

                {/* Klient */}
                <View style={styles.headerRow}>
                    <View style={{ flex: 3 }}>
                        <AppAutocomplete<Option>
                            label="Klient *"
                            value={customerValue}
                            options={customerOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={setCustomerValue}
                            onInputChange={handleCustomerSearchChange}
                            placeholder="Wybierz klienta"
                            disabled={isEdit}
                        />
                    </View>
                    {!isEdit && (
                        <View style={{ ...styles.buttonRow, marginTop: metrics.spacing.lg }}>
                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    icon={IconName.client}
                                    onPress={() => navigation.navigate('Customer')}
                                >
                                    Baza
                                </AppButton>
                            </View>
                        </View>
                    )}
                </View>

                {/* Sprzedawca */}
                <View style={{ marginTop: metrics.spacing.md }}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 3 }}>
                            <AppAutocomplete<Option>
                                label="Sprzedawca *"
                                value={sellerValue}
                                options={sellerOptions}
                                getOptionLabel={(o) => o.label}
                                onChange={setSellerValue}
                                onInputChange={handleSellerSearchChange}
                                placeholder="Wybierz sprzedawcę"
                                disabled={isEdit}
                            />
                        </View>
                        {!isEdit && (
                            <View style={{ ...styles.buttonRow, marginTop: metrics.spacing.lg }}>
                                <View style={styles.buttonWrapper}>
                                    <AppButton
                                        icon={IconName.seller}
                                        onPress={() => navigation.navigate('Seller')}
                                    >
                                        Baza
                                    </AppButton>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </AppCard>

            {!isEdit && (
                <OrderProductInputCard
                    orderId={id}
                    productsOptions={productOptions}
                    isLoading={productsLoading}
                    onAddProduct={handleAddProduct}
                    onSearchProduct={handleProductSearchChange}
                />
            )}

            <OrderProductList
                products={orderProducts}
                onRemove={!isEdit ? handleRemoveProduct : undefined}
            />

            <AppCard style={styles.card}>
                {isEdit && order ? (
                    <>
                        <View style={styles.cardHeaderWithButton}>
                            <AppText variant="titleLarge">Dostawa</AppText>
                            <AppButton
                                icon={IconName.delivery}
                                onPress={() => {
                                    setSelectedDelivery(order?.delivery || null);
                                    setDeliveryModalVisible(true);
                                }}
                            >
                                Zarządzaj
                            </AppButton>
                        </View>
                        <InfoItem
                            label="Adres"
                            value={formatAddressMultiline(order.delivery?.address)}
                        />
                        <InfoItem label="Przewoźnik" value={order.delivery?.carrierId || '-'} />
                        <InfoItem
                            label="Numer przesyłki"
                            value={order.delivery?.trackingNumber || '-'}
                        />
                    </>
                ) : (
                    <>
                        <AppText variant="titleLarge" style={styles.cardTitle}>
                            Dostawa
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.hint}>
                            Dostawa będzie dostępna po zapisaniu zamówienia.
                        </AppText>
                    </>
                )}
            </AppCard>

            <AppCard style={styles.card}>
                {isEdit ? (
                    <>
                        <View style={styles.cardHeaderWithButton}>
                            <AppText variant="titleLarge">Płatności</AppText>
                            <AppButton
                                icon={IconName.payment}
                                onPress={() => {
                                    setSelectedPayment(null);
                                    setPaymentModalVisible(true);
                                }}
                            >
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
                                        iconColor: isCompleted
                                            ? 'transparent'
                                            : theme.colors.primary,
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
                    </>
                ) : (
                    <>
                        <AppText variant="titleLarge" style={styles.cardTitle}>
                            Płatności
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.hint}>
                            Płatności są dodawane po utworzeniu zamówienia.
                        </AppText>
                    </>
                )}
            </AppCard>

            <View style={styles.actionRow}>
                <AppButton
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                >
                    Anuluj
                </AppButton>
                <AppButton
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                    loading={createLoading || updateLoading}
                >
                    {isEdit ? 'Zapisz zmiany' : 'Dodaj zamówienie'}
                </AppButton>
            </View>

            {/* Modale */}
            <AppModal visible={paymentModalVisible} onClose={() => setPaymentModalVisible(false)}>
                <AddPaymentForm onClose={() => setPaymentModalVisible(false)} />
            </AppModal>
            <AppModal visible={deliveryModalVisible} onClose={() => setDeliveryModalVisible(false)}>
                <AddDeliveryForm onClose={() => setDeliveryModalVisible(false)} />
            </AppModal>
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
        </ScrollView>
    );
};
