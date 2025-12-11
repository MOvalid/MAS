import React from 'react';
import { AppTextInput, AppTextInputProps } from './AppTextInput';

type AppNumberInputProps = Omit<AppTextInputProps, 'keyboardType' | 'value' | 'onChangeText'> & {
    value: string | number;
    onChangeValue: (value: string) => void;
    allowNegative?: boolean;
    allowDecimal?: boolean;
};

export const AppNumberInput: React.FC<AppNumberInputProps> = ({
    value,
    onChangeValue,
    allowNegative = false,
    allowDecimal = true,
    ...props
}) => {
    const handleChange = (text: string) => {
        let sanitized = text.replace(/[^0-9.,+-]/g, '');

        if (!allowNegative) {
            sanitized = sanitized.replace(/^-/, '');
        }

        if (allowDecimal) {
            sanitized = sanitized.replace(',', '.');
            const parts = sanitized.split('.');
            if (parts.length > 2) {
                sanitized = parts[0] + '.' + parts.slice(1).join('');
            }
        } else {
            sanitized = sanitized.replace(/[.,]/g, '');
        }

        sanitized = sanitized.replace(/(?!^)[+-]/g, '');

        onChangeValue(sanitized);
    };

    return (
        <AppTextInput
            {...props}
            keyboardType="numeric"
            value={String(value)}
            onChangeValue={handleChange}
        />
    );
};
