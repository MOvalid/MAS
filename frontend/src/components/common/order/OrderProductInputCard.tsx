import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppCard, AppText, AppButton } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { AppCurrencyInput } from '../AppCurrencyInput';
import { AppNumberInput } from '../AppNumberInput';
import { Currency } from '@/types/common';
import { useTheme } from 'react-native-paper';
import { AppAutocomplete } from '../AppAutocomplete';
import { CreateOrderItem } from '@/types/dto';

type ProductOption = {
    label: string;
    value: string;
    unitPrice?: number;
};

type Props = {
    orderId: string;
    productsOptions: ProductOption[];
    onAddProduct: (item: CreateOrderItem) => void;
    onSearchProduct?: (query: string) => void;
    isLoading?: boolean;
    editable?: boolean;
};

export const OrderProductInputCard: React.FC<Props> = ({
    orderId,
    productsOptions,
    onAddProduct,
    onSearchProduct,
    isLoading,
    editable = false,
}) => {
    const theme = useTheme();
    const [selectedProduct, setSelectedProduct] = useState<ProductOption | undefined>();
    const [quantity, setQuantity] = useState('1');
    const [unitPrice, setUnitPrice] = useState(0);

    useEffect(() => {
        if (selectedProduct) {
            setUnitPrice(selectedProduct.unitPrice ?? 0);
        }
    }, [selectedProduct]);

    const handleAddProduct = () => {
        if (!selectedProduct || !quantity || Number(quantity) <= 0) return;

        onAddProduct({
            productId: selectedProduct.value,
            quantity: Number(quantity),
        });

        setSelectedProduct(undefined);
        setQuantity('1');
        setUnitPrice(0);
        onSearchProduct?.('');
    };

    const styles = StyleSheet.create({
        container: {
            marginBottom: metrics.spacing.lg,
        },
        card: {
            padding: metrics.spacing.md,
            backgroundColor: theme.colors.background,
        },
        title: {
            marginBottom: metrics.spacing.sm,
            fontWeight: 'bold',
        },
        formContainer: {
            gap: metrics.spacing.md,
        },
        cardTitle: { marginBottom: metrics.spacing.md },
        detailsRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
            alignItems: 'flex-end',
        },
        inputWrapper: {
            flex: 1,
        },
        labelText: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: 4,
        },
        buttonContainer: {
            marginTop: metrics.spacing.xs,
        },
    });

    return (
        <View style={styles.container}>
            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Dodaj produkt
                </AppText>

                <View style={styles.formContainer}>
                    <View>
                        <AppAutocomplete<ProductOption>
                            label=""
                            value={selectedProduct}
                            options={productsOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={setSelectedProduct}
                            onInputChange={onSearchProduct}
                            placeholder="Szukaj produktu..."
                        />
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.inputWrapper}>
                            <AppText variant="bodySmall" style={styles.labelText}>
                                Ilość
                            </AppText>
                            <AppNumberInput
                                value={quantity}
                                onChangeValue={setQuantity}
                                allowDecimal={false}
                                allowNegative={false}
                                fullWidth
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <AppText variant="bodySmall" style={styles.labelText}>
                                Cena jedn.
                            </AppText>
                            <AppCurrencyInput
                                label=""
                                value={unitPrice}
                                currency={Currency.PLN}
                                editable={false}
                                onChangeValue={() => {}}
                                fullWidth
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <AppButton
                            mode="contained"
                            onPress={handleAddProduct}
                            icon="plus"
                            disabled={!selectedProduct}
                        >
                            Dodaj do listy
                        </AppButton>
                    </View>
                </View>
            </AppCard>
        </View>
    );
};
