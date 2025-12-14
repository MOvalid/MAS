import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';
import { OrderProductInputCard } from '@/components/common/order/OrderProductInputCard';
import { OrderProductList } from '@/components/common/order/OrderProductList';
import { AppModal } from '@/components/common/AppModal';
import { metrics } from '@/theme/metrics';
import { Order } from '@/types/domain/order';
import { Option } from '@/types/common';
import { OrderItem, ProductOption } from '@/types/domain';

// --- Mock data ---
const customers: Option[] = [
    { label: 'Firma Alfa Sp. z o.o.', value: 'c1' },
    { label: 'Jan Kowalski', value: 'c2' },
];
const sellers: Option[] = [
    { label: 'Sprzedawca 1', value: 's1' },
    { label: 'Sprzedawca 2', value: 's2' },
];
const mockProducts: ProductOption[] = [
    { label: 'Produkt A', value: 'p1', unitPrice: 100 },
    { label: 'Produkt B', value: 'p2', unitPrice: 250 },
];

const EMPTY_ORDER: Order = {
    id: '',
    createdAt: new Date().toISOString(),
    customerId: '',
    sellerId: '',
    deliveryId: null,
    invoiceId: null,
    orderProducts: null,
    payments: null,
};

// --- Placeholder forms ---
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

// --- Screen ---
export const OrderAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();
    const { id } = route.params ?? {};
    const isEdit = Boolean(id);

    const initial = isEdit ? { ...EMPTY_ORDER, id } : EMPTY_ORDER;

    const [customerValue, setCustomerValue] = useState<Option | undefined>();
    const [sellerValue, setSellerValue] = useState<Option | undefined>();
    const [orderProducts, setOrderProducts] = useState<OrderItem[]>([]);
    const [errors, setErrors] = useState<{ customer?: string; seller?: string }>({});

    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

    const pageTitle = isEdit ? `Edycja zamówienia #${id}` : 'Dodaj nowe zamówienie';

    const validate = (): boolean => {
        const e: { customer?: string; seller?: string } = {};
        if (!customerValue) e.customer = 'Wybierz klienta';
        if (!sellerValue) e.seller = 'Wybierz sprzedającego';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const payload: Order = {
            ...initial,
            customerId: customerValue!.value,
            sellerId: sellerValue!.value,
            orderProducts,
        };
        console.log(isEdit ? '➡️ Aktualizacja zamówienia:' : '🆕 Nowe zamówienie:', payload);
        navigation.goBack();
    };

    const handleAddProduct = (item: OrderItem) => setOrderProducts((prev) => [...prev, item]);
    const handleRemoveProduct = (index: number) =>
        setOrderProducts((prev) => prev.filter((_, i) => i !== index));

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

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={{ marginBottom: metrics.spacing.lg }}>
                {pageTitle}
            </AppText>

            {/* Informacje podstawowe */}
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
                                options={customers}
                                getOptionLabel={(o) => o.label}
                                onChange={setCustomerValue}
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
                                <AppButton icon={IconName.client} onPress={() => { }}>
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
                                options={sellers}
                                getOptionLabel={(o) => o.label}
                                onChange={setSellerValue}
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
                                <AppButton icon={IconName.seller} onPress={() => { }}>
                                    Przejdź do sprzedawców
                                </AppButton>
                            </View>
                        </View>
                    </View>
                </View>
            </AppCard>

            {/* Pozycje zamówienia */}
            <OrderProductInputCard
                orderId={initial.id}
                productsOptions={mockProducts}
                onAddProduct={handleAddProduct}
            />
            <OrderProductList products={orderProducts} onRemove={handleRemoveProduct} />

            {/* Dostawa */}
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

            {/* Płatności */}
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

            {/* Akcje */}
            <View style={styles.actionRow}>
                <AppButton
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                >
                    Anuluj
                </AppButton>
                <AppButton mode="contained" onPress={handleSave} style={styles.button}>
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
        </ScrollView>
    );
};
