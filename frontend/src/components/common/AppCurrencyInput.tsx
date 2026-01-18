// AppCurrencyInput.tsx
import React, { useEffect, useState } from 'react';
import { View, ViewStyle, DimensionValue, StyleSheet } from 'react-native';
import type { TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { AppTextInput } from './AppTextInput';
import { AppDropdown } from './AppDropdown';
import { metrics } from '@/theme/metrics';
import { Currency } from '@/types/common';
import { formatNumber } from '@/utils/formatters';
import { sanitizeNumericInput } from '@/utils/price-utils';

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

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setRawValue(value !== null && !isNaN(value) ? formatNumber(value) : '');
        }
    }, [value, isEditing]);

    const handleFocus = () => setIsEditing(true);
    const handleBlur = () => setIsEditing(false);

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
                    height={48}
                    label={label}
                    value={rawValue}
                    onChangeText={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    fullWidth={fullWidth}
                    disabled={!editable}
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
                    disabled={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: { flex: 2 },
    dropdown: { flex: 1, maxWidth: 100 },
});
