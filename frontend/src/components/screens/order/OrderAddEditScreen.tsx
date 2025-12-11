import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { Order } from '@/types/domain/order';
import { Option } from '@/types/common';
import { OrderProductInputCard } from '@/components/common/order/OrderProductInputCard';
import { OrderProductList } from '@/components/common/order/OrderProductList';
import { OrderItem, ProductOption } from '@/types/domain';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';

const customers: Option[] = [
    { label: 'Firma Alfa Sp. z o.o.', value: 'c1' },
    { label: 'Jan Kowalski', value: 'c2' },
    { label: 'Anna Nowak', value: 'c3' },
];

const sellers: Option[] = [
    { label: 'Sprzedawca 1', value: 's1' },
    { label: 'Sprzedawca 2', value: 's2' },
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

export const OrderAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);
    const initial = isEdit ? { ...EMPTY_ORDER, id } : EMPTY_ORDER;

    const mockProducts: ProductOption[] = [
        { label: 'Produkt A', value: 'p1', unitPrice: 1.0 },
        { label: 'Produkt B', value: 'p2', unitPrice: 2.0 },
        { label: 'Produkt C', value: 'p3', unitPrice: 3.0 },
    ];

    const [customerValue, setCustomerValue] = useState<Option | undefined>(
        customers.find((c) => c.value === initial.customerId)
    );
    const [sellerValue, setSellerValue] = useState<Option | undefined>(
        sellers.find((s) => s.value === initial.sellerId)
    );
    const [orderProducts, setOrderProducts] = useState<OrderItem[]>([]);
    const [errors, setErrors] = useState<{ customer?: string; seller?: string }>({});

    const handleAddProduct = (item: OrderItem) => setOrderProducts((prev) => [...prev, item]);
    const handleRemoveProduct = (index: number) =>
        setOrderProducts((prev) => prev.filter((_, i) => i !== index));

    const getFilteredOptions = (options: Option[], input: string) =>
        !input
            ? options
            : options.filter((o) => o.label.toLowerCase().includes(input.toLowerCase()));

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
            customerId: customerValue?.value ?? '',
            sellerId: sellerValue?.value ?? '',
            deliveryId: null,
            invoiceId: null,
            orderProducts: null,
            payments: null,
        };

        console.log(isEdit ? '➡️ Aktualizacja zamówienia:' : '🆕 Tworzenie zamówienia:', payload);
        navigation.goBack();
    };

    const handleCancel = () => navigation.goBack();

    const styles = StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg },
        card: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingVertical: metrics.spacing.md,
            marginBottom: metrics.spacing.lg,
        },
        actionRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: metrics.spacing.md,
            marginVertical: metrics.spacing.sm,
        },
        button: { minWidth: 160 },
    });

    const ActionButtons = () => (
        <View style={styles.actionRow}>
            <AppButton onPress={handleCancel} style={styles.button} mode="outlined">
                Anuluj
            </AppButton>
            <AppButton onPress={handleSave} style={styles.button} mode="contained">
                {isEdit ? 'Zapisz zmiany' : 'Dodaj zamówienie'}
            </AppButton>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={{ marginBottom: metrics.spacing.lg }}>
                {pageTitle}
            </AppText>

            <AppCard style={styles.card}>
                <View>
                    <AppAutocomplete<Option>
                        label="Klient *"
                        value={customerValue}
                        options={getFilteredOptions(customers, customerValue?.label ?? '')}
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
                <View>
                    <AppAutocomplete<Option>
                        label="Sprzedający *"
                        value={sellerValue}
                        options={getFilteredOptions(sellers, sellerValue?.label ?? '')}
                        getOptionLabel={(o) => o.label}
                        onChange={setSellerValue}
                        placeholder="Wybierz sprzedającego"
                    />
                    {errors.seller && (
                        <AppText variant="bodySmall" style={{ color: theme.colors.error }}>
                            {errors.seller}
                        </AppText>
                    )}
                </View>
            </AppCard>

            <OrderProductInputCard
                orderId={initial.id}
                productsOptions={mockProducts}
                onAddProduct={handleAddProduct}
            />

            <OrderProductList products={orderProducts} onRemove={handleRemoveProduct} />

            <ActionButtons />
        </ScrollView>
    );
};
