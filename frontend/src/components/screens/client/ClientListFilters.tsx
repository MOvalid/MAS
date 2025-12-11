// src/components/client/ClientListFilters.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppDropdown, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useTheme } from 'react-native-paper';
import { ClientSort, ClientTypeFilter } from '@/types/common';

interface ClientListFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;

    clientType: ClientTypeFilter;
    onClientTypeChange: (value: ClientTypeFilter) => void;

    sortBy: ClientSort;
    onSortByChange: (value: ClientSort) => void;
}

export const ClientListFilters: React.FC<ClientListFiltersProps> = ({
    search,
    onSearchChange,
    clientType,
    onClientTypeChange,
    sortBy,
    onSortByChange,
}) => {
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
                        Wyszukaj klienta / firmę
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
                        Typ klienta
                    </AppText>
                    <AppDropdown
                        value={clientType}
                        onChange={(v: string) => onClientTypeChange(v as ClientTypeFilter)}
                        fullWidth
                        options={[
                            { label: 'Wszyscy', value: 'ALL' },
                            { label: 'Klienci (osoby)', value: 'CUSTOMER' },
                            { label: 'Firmy', value: 'COMPANY' },
                        ]}
                    />
                </View>

                <View style={styles.col1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sortuj alfabetycznie
                    </AppText>
                    <AppDropdown
                        value={sortBy}
                        onChange={(v: string) => onSortByChange(v as ClientSort)}
                        fullWidth
                        options={[
                            { label: 'A → Z', value: 'ALPHA_ASC' },
                            { label: 'Z → A', value: 'ALPHA_DESC' },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};
