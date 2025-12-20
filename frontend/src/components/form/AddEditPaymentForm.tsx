import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, AppButton, AppDropdown } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { PAYMENT_METHODS, PaymentMethod } from '@/types/common';
import { AppNumberInput } from '../common/AppNumberInput';
import { AppCheckboxGroup } from '../common/AppCheckboxGroup';

interface AddEditPaymentFormProps {
    initialAmount?: number;
    initialCurrency?: string;
    initialMethod?: PaymentMethod;
    onSave: (amount: number, currency: string, method: PaymentMethod) => void;
    onClose: () => void;
}

export const AddEditPaymentForm: React.FC<AddEditPaymentFormProps> = ({
    initialAmount,
    initialCurrency = 'PLN',
    initialMethod,
    onSave,
    onClose,
}) => {
    const [amount, setAmount] = useState(initialAmount?.toString() ?? '');
    const [currency] = useState(initialCurrency);
    const [method, setMethod] = useState<PaymentMethod | undefined>(initialMethod);

    const handleSave = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0 || !method) return;
        onSave(amt, currency, method);
        onClose();
    };

    return (
        <View>
            <AppText variant="titleLarge">{method ? 'Edytuj płatność' : 'Dodaj płatność'}</AppText>

            <AppNumberInput label="Kwota" fullWidth value={amount} onChangeValue={setAmount} />

            <AppDropdown
                label="Waluta"
                disabled
                fullWidth
                options={[
                    { label: 'PLN', value: 'PLN' },
                    { label: 'EUR', value: 'EUR' },
                ]}
                value={currency}
                onChange={() => {
                    console.log('');
                }}
            />

            <View>
                <AppText variant="bodyMedium" style={styles.label}>
                    Metoda płatności
                </AppText>
                <AppCheckboxGroup
                    options={PAYMENT_METHODS}
                    selectedValue={method ?? 'BANK_TRANSFER'}
                    onChange={(v) => setMethod(v as PaymentMethod)}
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
    label: { marginBottom: 8 },
    buttonsRow: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
        marginTop: metrics.spacing.md,
    },
});
