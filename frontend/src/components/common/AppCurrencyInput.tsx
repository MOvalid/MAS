// AppCurrencyInput.tsx
import React, { useState } from 'react';
import { View, ViewStyle, DimensionValue, StyleSheet } from 'react-native';
import type { TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { AppTextInput } from './AppTextInput';
import { AppDropdown } from './AppDropdown';
import { metrics } from '@/theme/metrics';
import { Currency } from '@/types/common';
import { formatNumber } from '@/utils/formatters';

interface AppCurrencyInputProps extends Omit<PaperTextInputProps, 'onChangeText' | 'value'> {
    label?: string;
    value: number | null;
    onChangeValue?: (value: number | null) => void;
    currency: Currency;
    onChangeCurrency?: (currency: Currency) => void;
    width?: number | string;
    fullWidth?: boolean;
    editable?: boolean;
}

const sanitizeNumericInput = (text: string): string => {
    return text.replace(/[^\d,.]/g, '').replace(',', '.');
};

export const AppCurrencyInput: React.FC<AppCurrencyInputProps> = ({
    label,
    value,
    onChangeValue,
    currency,
    onChangeCurrency,
    width,
    fullWidth = false,
    editable = true,
    ...props
}) => {
    const [rawValue, setRawValue] = useState<string>(
        value !== null && !isNaN(value) ? formatNumber(value) : ''
    );

    const handleChangeText = (text: string) => {
        if (!editable) return;
        const cleaned = sanitizeNumericInput(text);
        const num = parseFloat(cleaned);
        setRawValue(text);
        onChangeValue?.(isNaN(num) ? null : num);
    };

    const currencyOptions = Object.values(Currency).map((currency) => ({
        label: currency,
        value: currency,
    }));

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        width: (fullWidth ? '100%' : width) as DimensionValue,
        gap: metrics.spacing.sm,
    };

    return (
        <View style={containerStyle}>
            <View style={styles.textInput}>
                <AppTextInput
                    label={label}
                    value={rawValue}
                    onChangeText={handleChangeText}
                    keyboardType="numeric"
                    fullWidth={fullWidth}
                    editable={editable}
                    {...props}
                />
            </View>

            <View style={styles.dropdown}>
                <AppDropdown
                    options={currencyOptions}
                    value={currency}
                    onChange={(val) => {
                        if (editable) onChangeCurrency?.(val as Currency);
                    }}
                    width="100%"
                    disabled={!editable}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: { flex: 1 },
    dropdown: { width: 100 },
});
