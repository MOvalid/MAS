import React from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { AppText } from './AppText';
import { useAppTheme } from '../../context/AppThemeContext';
import { metrics } from '../../theme/metrics';

export interface CheckboxOption<T = string> {
    label: string;
    value: T;
}

interface AppCheckboxGroupProps<T = string> {
    options: CheckboxOption<T>[];
    selectedValue: T;
    onChange: (value: T) => void;
    numColumns?: number;
    errorMessage?: string;
}

export const AppCheckboxGroup = <T extends string>({
    options,
    selectedValue,
    onChange,
    numColumns = 1,
    errorMessage = '',
}: AppCheckboxGroupProps<T>) => {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -metrics.spacing.xs,
        },
        optionWrapper: {
            width: `${100 / numColumns}%`,
            paddingHorizontal: metrics.spacing.xs,
            marginBottom: metrics.spacing.sm,
        },
        optionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: metrics.spacing.sm,
            paddingVertical: metrics.spacing.xs,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: metrics.radius.sm,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorContainer: {
            marginTop: metrics.spacing.xs,
            minHeight: metrics.spacing.md,
        },
        errorText: {
            color: colors.error,
            fontSize: metrics.text.small,
        },
    });

    return (
        <View style={styles.container}>
            {options.map((option) => (
                <View key={String(option.value)} style={styles.optionWrapper}>
                    <Pressable style={styles.optionRow} onPress={() => onChange(option.value)}>
                        <View
                            style={[
                                styles.checkbox,
                                {
                                    backgroundColor:
                                        selectedValue === option.value
                                            ? colors.primary
                                            : 'transparent',
                                    borderColor: colors.primary,
                                },
                            ]}
                        />
                        <AppText numberOfLines={1} style={{ flex: 1 }}>
                            {option.label}
                        </AppText>
                    </Pressable>
                </View>
            ))}

            {errorMessage ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : null}
        </View>
    );
};
