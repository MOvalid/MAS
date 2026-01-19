import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TextInputProps as PaperTextInputProps, Text } from 'react-native';
import { Autocomplete } from 'react-native-paper-autocomplete';
import { AppText } from '@/components/common';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useAppTheme } from '@/context/AppThemeContext';

type AppAutocompleteProps<T> = {
    label: string;
    value?: T;
    options: T[];
    getOptionLabel: (option: T) => string;
    onChange: (option?: T) => void;
    onInputChange?: (text: string) => void;
    placeholder?: string;
    errorMessage?: string;
    inputProps?: Partial<PaperTextInputProps>;
};

export function AppAutocomplete<T>({
    label,
    value,
    options,
    getOptionLabel,
    onChange,
    onInputChange,
    placeholder = 'Wybierz...',
    errorMessage,
}: AppAutocompleteProps<T>) {
    const theme = useTheme();
    const { colors } = useAppTheme();
    const [inputValue, setInputValue] = useState(value ? getOptionLabel(value) : '');
    const [filterActive, setFilterActive] = useState(false);

    const debouncedSearch = useMemo(() => {
        let timeout: NodeJS.Timeout;
        return (text: string) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                onInputChange?.(text);
            }, 500);
        };
    }, [onInputChange]);

    useEffect(() => {
        setInputValue(value ? getOptionLabel(value) : '');
    }, [value]);

    const getFilteredOptions = (opts: T[], input: string, active: boolean) => {
        if (onInputChange) {
            return opts;
        }
        if (!active || !input) return opts;
        return opts.filter((o) => getOptionLabel(o).toLowerCase().includes(input.toLowerCase()));
    };

    const errorMessageStyle = {
        color: colors.error,
        fontSize: metrics.text.small,
        marginLeft: metrics.spacing.md,
    } as const;

    const styles = StyleSheet.create({
        wrapper: { flex: 1 },
        input: {
            height: 48,
            alignContent: 'center',
            borderRadius: metrics.radius.xl,
            borderWidth: 0,
            backgroundColor: colors.secondaryContainer,
        },
        outerWrapper: {
            borderRadius: metrics.radius.xl,
            overflow: 'hidden',
            marginVertical: metrics.spacing.lmd,

            backgroundColor: colors.secondaryContainer,
        },
        labelText: { color: theme.colors.onSurfaceVariant },

        errorContainerStyle: {
            position: 'absolute' as const,
            bottom: -metrics.spacing.lg,
            left: 0,
            right: 0,
            height: metrics.spacing.lg,
            justifyContent: 'center' as const,
        },
    });

    return (
        <View style={styles.wrapper}>
            <AppText variant="bodyLarge" style={styles.labelText}>
                {label}
            </AppText>
            <View style={styles.outerWrapper}>
                <Autocomplete<T>
                    value={value}
                    onChange={(option) => {
                        onChange(option);
                        setInputValue(option ? getOptionLabel(option) : '');
                        setFilterActive(false);
                    }}
                    options={getFilteredOptions(options, inputValue, filterActive)}
                    getOptionLabel={getOptionLabel}
                    inputProps={{
                        placeholder,
                        value: inputValue,
                        onChangeText: (text) => {
                            setInputValue(text);
                            setFilterActive(true);
                            debouncedSearch(text);
                        },
                        onFocus: () => {
                            setFilterActive(true);
                        },
                        style: styles.input,
                        outlineColor: 'transparent',
                        activeOutlineColor: 'transparent',
                        mode: 'outlined',
                        selectionColor: colors.primary,
                    }}
                />
            </View>
            <View style={styles.errorContainerStyle}>
                {errorMessage ? <Text style={errorMessageStyle}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
}
