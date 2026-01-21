// @/components/form/AddEditPaymentForm.tsx
import React, { useState, useEffect } from 'react';
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
    // 1. Formatowanie ceny na start (zamiana liczby na string akceptowalny przez input)
    const [amount, setAmount] = useState(
        initialAmount !== undefined ? initialAmount.toString() : ''
    );
    const [currency] = useState(initialCurrency);

    // 2. Zapewnienie, że metoda jest zainicjalizowana z initialMethod
    const [method, setMethod] = useState<PaymentMethod | undefined>(initialMethod);

    const isEdit = !!initialAmount; // Flaga trybu edycji

    const handleSave = () => {
        const amt = parseFloat(amount.replace(',', '.')); // Obsługa obu separatorów
        if (isNaN(amt) || amt <= 0 || !method) return;
        onSave(amt, currency, method);
        onClose();
    };

    return (
        <View style={styles.container}>
            <AppText variant="titleLarge" style={styles.title}>
                {isEdit ? 'Edytuj status płatności' : 'Dodaj płatność'}
            </AppText>

            <AppNumberInput
                label="Kwota"
                fullWidth
                value={amount}
                onChangeValue={setAmount}
                // Jeśli edytujemy, możemy zablokować zmianę kwoty zgodnie z wymaganiem PUT /payment/{id}
                disabled={isEdit}
            />

            <AppDropdown
                label="Waluta"
                disabled
                fullWidth
                options={[{ label: 'PLN', value: 'PLN' }]}
                value={currency}
                onChange={() => {}}
            />

            <View style={styles.methodSection}>
                <AppText variant="bodyMedium" style={styles.label}>
                    Metoda płatności
                </AppText>
                <AppCheckboxGroup
                    options={PAYMENT_METHODS}
                    selectedValue={method ?? 'BANK_TRANSFER'}
                    onChange={(v) => {
                        if (!isEdit) {
                            setMethod(v as PaymentMethod);
                        }
                    }}
                />
                {isEdit && (
                    <AppText variant="bodySmall" style={styles.helperText}>
                        Metoda płatności nie może być zmieniona podczas edycji.
                    </AppText>
                )}
            </View>

            <View style={styles.buttonsRow}>
                <AppButton mode="outlined" onPress={onClose} style={styles.button}>
                    Anuluj
                </AppButton>
                <AppButton mode="contained" onPress={handleSave} style={styles.button}>
                    Zapisz
                </AppButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: metrics.spacing.xs,
    },
    title: {
        marginBottom: metrics.spacing.lg,
    },
    methodSection: {
        marginTop: metrics.spacing.md,
    },
    label: {
        marginBottom: metrics.spacing.xs,
        fontWeight: '600',
    },
    helperText: {
        color: '#888',
        fontStyle: 'italic',
        marginTop: metrics.spacing.xs,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
        marginTop: metrics.spacing.xl,
    },
    button: {
        flex: 1,
    },
});
