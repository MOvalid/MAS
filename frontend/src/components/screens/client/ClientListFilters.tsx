// src/components/client/ClientListFilters.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppDropdown, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useTheme } from 'react-native-paper';

interface ClientListFiltersProps<T> {
    search: string;
    onSearchChange: (value: string) => void;
    sortBy: T;
    onSortByChange: (value: T) => void;
    options: { label: string; value: T }[];
    searchLabel?: string;
}

export const ClientListFilters = <T extends string>({
    search,
    onSearchChange,
    sortBy,
    onSortByChange,
    options,
    searchLabel = 'Wyszukaj klienta / firmę',
}: ClientListFiltersProps<T>) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: metrics.spacing.md,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            flexWrap: 'wrap',
            gap: metrics.spacing.md,
        },
        col1: {
            flex: 1,
        },
        col2: {
            flex: 2,
        },
        labelText: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: metrics.spacing.xs,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.col2}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        {searchLabel}
                    </AppText>
                    <AppTextInput
                        placeholder="Wyszukaj"
                        value={search}
                        onChangeText={onSearchChange}
                        fullWidth
                    />
                </View>

                <View style={styles.col1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sortowanie
                    </AppText>
                    <AppDropdown
                        value={sortBy}
                        onChange={(v: string) => onSortByChange(v as T)}
                        fullWidth
                        options={options}
                    />
                </View>
            </View>
        </View>
    );
};
