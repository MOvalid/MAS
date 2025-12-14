// AppCheckboxGroup.tsx
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics } from '../../theme/metrics';

export interface CheckboxOption<T = string> {
    label: string;
    value: T;
}

interface AppCheckboxGroupProps<T = string> {
    options: CheckboxOption<T>[];
    selectedValue: T;
    onChange: (value: T) => void;
    horizontal?: boolean;
}

export const AppCheckboxGroup = <T extends string>({
    options,
    selectedValue,
    onChange,
    horizontal = false,
}: AppCheckboxGroupProps<T>) => {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                horizontal && { flexDirection: 'row', flexWrap: 'wrap', gap: metrics.spacing.md },
            ]}
        >
            {options.map((option) => (
                <Pressable
                    key={String(option.value)}
                    style={[styles.optionRow, horizontal && { marginRight: metrics.spacing.md }]}
                    onPress={() => onChange(option.value)}
                >
                    <View
                        style={[
                            styles.checkbox,
                            {
                                backgroundColor:
                                    selectedValue === option.value ? colors.primary : 'transparent',
                                borderColor: colors.primary,
                            },
                        ]}
                    />
                    <AppText>{option.label}</AppText>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: metrics.spacing.sm,
        gap: metrics.spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: metrics.radius.sm,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
