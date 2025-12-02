import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppCard, AppText, AppButton } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { OrderItem } from '@/types/domain/order-item';
import { AppCurrencyInput } from '../AppCurrencyInput';
import { AppNumberInput } from '../AppNumberInput';
import { Currency } from '@/types/common';
import { useTheme } from 'react-native-paper';
import { ProductOption } from '@/types/domain';
import { AppAutocomplete } from '../AppAutocomplete';

type Props = {
    orderId: string;
    productsOptions: ProductOption[];
    onAddProduct: (item: OrderItem) => void;
};

export const OrderProductInputCard: React.FC<Props> = ({
    orderId,
    productsOptions,
    onAddProduct,
}) => {
    const theme = useTheme();
    const [selectedProduct, setSelectedProduct] = useState<ProductOption | undefined>();
    const [quantity, setQuantity] = useState('1');
    const [unitPrice, setUnitPrice] = useState(0);

    useEffect(() => {
        setUnitPrice(selectedProduct?.unitPrice ?? 0);
    }, [selectedProduct]);

    const handleAddProduct = () => {
        if (!selectedProduct || !quantity || Number(quantity) <= 0) return;

        onAddProduct({
            orderId,
            productName: selectedProduct.label,
            productId: selectedProduct.value,
            quantity: Number(quantity),
            unitPrice,
        });

        setSelectedProduct(undefined);
        setQuantity('1');
        setUnitPrice(0);
    };

    const styles = StyleSheet.create({
        labelsRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
            marginBottom: metrics.spacing.xs,
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: metrics.spacing.md,
            flexWrap: 'wrap',
        },
        autocompleteWrapper: { flex: 2, minWidth: 150 },
        inputWrapper: { minWidth: 80 },
        currencyWrapper: { flex: 1, minWidth: 120 },
        addButtonWrapper: { justifyContent: 'center', minHeight: 60 },
        labelText: {
            color: theme.colors.onSurfaceVariant,
        },
    });

    return (
        <View>
            <AppCard>
                <View style={styles.inputRow}>
                    <View style={styles.autocompleteWrapper}>
                        <AppAutocomplete<ProductOption>
                            label="Produkt"
                            value={selectedProduct}
                            options={productsOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={setSelectedProduct}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <AppText variant="bodyLarge" style={styles.labelText}>
                            Ilość
                        </AppText>
                        <AppNumberInput
                            value={quantity}
                            onChangeValue={setQuantity}
                            allowDecimal={false}
                            allowNegative={false}
                            width={80}
                        />
                    </View>

                    <View style={styles.currencyWrapper}>
                        <AppText variant="bodyLarge" style={styles.labelText}>
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

                    <View style={styles.addButtonWrapper}>
                        <AppText variant="bodyLarge"> </AppText>
                        <AppButton mode="contained" onPress={handleAddProduct}>
                            Dodaj
                        </AppButton>
                    </View>
                </View>
            </AppCard>
        </View>
    );
};
