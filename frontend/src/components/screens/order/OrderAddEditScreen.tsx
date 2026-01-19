import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';
import {
    OrderProductInputCard,
    ProductOption,
} from '@/components/common/order/OrderProductInputCard';
import { OrderProductList } from '@/components/common/order/OrderProductList';
import { AppModal } from '@/components/common/AppModal';
import { metrics } from '@/theme/metrics';
import { Currency, Option, PersonBase } from '@/types/common';
import { OrderItem } from '@/types/domain';
import { useCreateOrder, useOrder, useUpdateOrder } from '@/composables/orders/useOrders';
import { useCustomerOptions } from '@/composables/customer/useCustomers';
import { CreateOrderItem, CreateOrderPayload } from '@/types/dto';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorMessage } from '@/components/common/AppStageMessage';
import { useSellerOptions } from '@/composables/seller/useSellers';
import { useProductOptions } from '@/composables/product/useProducts';

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

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);
    const { data: fetchedOrder, error: fetchOrderError, loading, refresh } = useOrder(id);

    const { create, loading: createLoading } = useCreateOrder(() => navigation.goBack());
    const { update, loading: updateLoading } = useUpdateOrder(() => navigation.goBack());

    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchSeller, setSearchSeller] = useState('');
    const [searchProduct, setSearchProduct] = useState('');

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
        if (!isEdit || !fetchedOrder) return;

        setOrderProducts(fetchedOrder.orderProducts || []);

        const customerOpt = formatPersonLabel(fetchedOrder.customer, 'Klient');
        if (customerOpt) setCustomerValue(customerOpt);

        const sellerOpt = formatPersonLabel(fetchedOrder.seller, 'Sprzedawca');
        if (sellerOpt) setSellerValue(sellerOpt);
    }, [fetchedOrder, isEdit]);

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

    const pageTitle = isEdit ? `Edycja zamówienia #${id}` : 'Dodaj nowe zamówienie';

    const validate = (): boolean => {
        const e: { customer?: string; seller?: string } = {};
        if (!customerValue) e.customer = 'Wybierz klienta';
        if (!sellerValue) e.seller = 'Wybierz sprzedającego';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

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
            // await update(fetchedOrder?.id, payload);
        } else {
            await create(payload);
        }
    };

    const handleAddProduct = (item: CreateOrderItem) => {
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
        setOrderProducts((prev) => {
            const newProducts = prev.filter((_, i) => i !== index);
            return newProducts;
        });
    };

    const styles = StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg, gap: metrics.spacing.lg },
        card: { backgroundColor: theme.colors.background, marginBottom: metrics.spacing.lg },
        cardTitle: { marginBottom: metrics.spacing.md },
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

    if (loading) {
        return <LoadingScreen text="Ładowanie danych..." />;
    }

    if (fetchOrderError) {
        return (
            <ErrorMessage
                error={fetchOrderError}
                onRetry={refresh}
                onBack={() => navigation.goBack()}
            />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={{ marginBottom: metrics.spacing.lg }}>
                {pageTitle}
            </AppText>

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Informacje podstawowe
                </AppText>
                <View>
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
                            />
                            {errors.customer && (
                                <AppText variant="bodySmall" style={{ color: theme.colors.error }}>
                                    {errors.customer}
                                </AppText>
                            )}
                        </View>

                        <View style={{ ...styles.buttonRow, marginTop: metrics.spacing.lg }}>
                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    icon={IconName.client}
                                    onPress={() => {
                                        navigation.navigate('Customer');
                                    }}
                                >
                                    Przejdź do klientów
                                </AppButton>
                            </View>
                        </View>
                    </View>
                </View>
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
                            />
                            {errors.seller && (
                                <AppText variant="bodySmall" style={{ color: theme.colors.error }}>
                                    {errors.seller}
                                </AppText>
                            )}
                        </View>

                        <View style={{ ...styles.buttonRow, marginTop: metrics.spacing.lg }}>
                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    icon={IconName.seller}
                                    onPress={() => {
                                        navigation.navigate('Seller');
                                    }}
                                >
                                    Przejdź do sprzedawców
                                </AppButton>
                            </View>
                        </View>
                    </View>
                </View>
            </AppCard>

            <OrderProductInputCard
                orderId={id}
                productsOptions={productOptions}
                isLoading={productsLoading}
                onAddProduct={handleAddProduct}
                onSearchProduct={handleProductSearchChange}
            />
            <OrderProductList products={orderProducts} onRemove={handleRemoveProduct} />

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Dostawa
                </AppText>
                {isEdit ? (
                    <AppButton onPress={() => setDeliveryModalVisible(true)}>
                        Dodaj / Edytuj dostawę
                    </AppButton>
                ) : (
                    <AppText variant="bodyLarge" style={styles.hint}>
                        Dostawa będzie dostępna po zapisaniu zamówienia.
                    </AppText>
                )}
            </AppCard>

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Płatności
                </AppText>
                {isEdit ? (
                    <AppButton onPress={() => setPaymentModalVisible(true)}>
                        Dodaj płatność
                    </AppButton>
                ) : (
                    <AppText variant="bodyLarge" style={styles.hint}>
                        Płatności są dodawane po utworzeniu zamówienia.
                    </AppText>
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

            <AppModal visible={paymentModalVisible} onClose={() => setPaymentModalVisible(false)}>
                <AddPaymentForm onClose={() => setPaymentModalVisible(false)} />
            </AppModal>
            <AppModal visible={deliveryModalVisible} onClose={() => setDeliveryModalVisible(false)}>
                <AddDeliveryForm onClose={() => setDeliveryModalVisible(false)} />
            </AppModal>
        </ScrollView>
    );
};
