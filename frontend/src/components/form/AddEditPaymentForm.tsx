// @/components/form/AddEditPaymentForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, AppButton, AppDropdown } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { PAYMENT_METHODS, PaymentMethod } from '@/types/common';
import { AppNumberInput } from '../common/AppNumberInput';
import { AppCheckboxGroup } from '../common/AppCheckboxGroup';
import { useAppTheme } from '@/context/AppThemeContext';

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
    const { colors } = useAppTheme();
    const [amount, setAmount] = useState(
        initialAmount !== undefined ? initialAmount.toString() : ''
    );
    const [currency] = useState(initialCurrency);
    const [method, setMethod] = useState<PaymentMethod | undefined>(initialMethod);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = !!initialAmount;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        const parsedAmount = parseFloat(amount.replace(',', '.'));

        if (!amount || amount.trim() === '') {
            newErrors.amount = 'Kwota płatności jest wymagana';
        } else if (isNaN(parsedAmount)) {
            newErrors.amount = 'Wprowadź poprawną liczbę';
        } else if (parsedAmount <= 0) {
            newErrors.amount = 'Kwota płatności musi być większa od zera';
        }

        if (!method) newErrors.method = 'Metoda płatności jest wymagana';
        if (!currency) newErrors.currency = 'Waluta płatności jest wymagana';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const amt = parseFloat(amount.replace(',', '.'));
        if (!method) return;

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
                disabled={isEdit}
                errorMessage={errors.amount}
            />

            <AppDropdown
                label="Waluta"
                disabled
                fullWidth
                options={[{ label: 'PLN', value: 'PLN' }]}
                value={currency}
                errorMessage={errors.currency}
                onChange={() => {}}
            />

            <View style={styles.methodSection}>
                <AppText variant="bodyMedium" style={styles.label}>
                    Metoda płatności
                </AppText>
                <AppCheckboxGroup
                    options={PAYMENT_METHODS}
                    selectedValue={method ?? 'BANK_TRANSFER'}
                    errorMessage={errors.amount}
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

            <View style={[styles.footer, { borderTopColor: colors.outlineVariant }]}>
                <View style={styles.buttonContainer}>
                    <AppButton mode="outlined" onPress={onClose}>
                        Anuluj
                    </AppButton>
                    <AppButton mode="contained" onPress={handleSave}>
                        Zapisz
                    </AppButton>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: metrics.spacing.xs,
    },
    footer: {
        borderTopWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: metrics.spacing.md,
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
});
