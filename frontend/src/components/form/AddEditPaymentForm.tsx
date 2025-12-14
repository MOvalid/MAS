import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, AppButton, AppDropdown } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { PAYMENT_METHODS, PaymentMethod } from '@/types/common';
import { AppNumberInput } from '../common/AppNumberInput';
import { AppCheckboxGroup } from '../common/AppCheckboxGroup';

interface AddEditPaymentFormProps {
    initialAmount?: number | null;
    initialCurrency?: string | null;
    initialMethod?: PaymentMethod | null;
    onSave: (amount: number, currency: string, method: PaymentMethod) => void;
    onClose: () => void;
}

export const AddEditPaymentForm: React.FC<AddEditPaymentFormProps> = ({
    initialAmount = null,
    initialCurrency = 'PLN',
    initialMethod = null,
    onSave,
    onClose,
}) => {
    const [amount, setAmount] = useState<string>('');
    const [currency] = useState(initialCurrency);
    const [method, setMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        if (initialAmount !== null) setAmount(initialAmount.toString());
        if (initialMethod) setMethod(initialMethod);
    }, [initialAmount, initialMethod]);

    const handleSave = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0 || !method) return;
        onSave(amt, currency || '', method);
        onClose();
    };

    return (
        <View>
            <AppText variant="titleLarge">
                {initialMethod ? 'Edytuj płatność' : 'Dodaj płatność'}
            </AppText>

            <AppNumberInput label="Kwota" fullWidth value={amount} onChangeValue={setAmount} />

            <AppDropdown
                label="Waluta"
                disabled={true}
                fullWidth
                options={[
                    { label: 'PLN', value: 'PLN' },
                    { label: 'EUR', value: 'EUR' },
                ]}
                value={currency || ''}
                onChange={() => console.log('This action is deprecated')}
            />

            <View>
                <AppText variant="bodyMedium" style={{ marginBottom: metrics.spacing.sm }}>
                    Metoda płatności
                </AppText>

                <AppCheckboxGroup
                    options={PAYMENT_METHODS}
                    selectedValue={method || ''}
                    onChange={(value) => setMethod(value as PaymentMethod)}
                />
            </View>

            <View style={styles.buttonsRow}>
                <AppButton mode="outlined" onPress={onClose}>
                    Anuluj
                </AppButton>
                <AppButton mode="contained" onPress={handleSave}>
                    Zapisz
                </AppButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonsRow: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
        marginTop: metrics.spacing.md,
    },
});
