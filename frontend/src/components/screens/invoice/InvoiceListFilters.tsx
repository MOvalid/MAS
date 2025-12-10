import { AppTextInput, AppDateRangeFilter, AppDropdown, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { InvoiceStatus } from '@/types/common';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface InvoiceListFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;

    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;

    status: InvoiceStatus;
    onStatusChange: (value: InvoiceStatus) => void;

    sortBy: string;
    onSortByChange: (value: string) => void;

    dateError?: string | null;
}

export const InvoiceListFilters: React.FC<InvoiceListFiltersProps> = ({
    search,
    onSearchChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    status,
    onStatusChange,
    sortBy,
    onSortByChange,
    dateError,
}) => {
    const theme = useTheme();
    const handleStatusChange = (value: string) => {
        if (Object.values(InvoiceStatus).includes(value as InvoiceStatus)) {
            onStatusChange(value as InvoiceStatus);
        }
    };

    const styles = StyleSheet.create({
        filtersContainer: {
            width: '100%',
            marginBottom: metrics.spacing.md,
        },
        filterRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            flexWrap: 'wrap',
            gap: metrics.spacing.md,
        },
        filterColumn1: {
            flex: 1,
            width: '100%',
        },
        filterColumn2: {
            flex: 2,
            width: '100%',
        },
        labelText: { color: theme.colors.onSurfaceVariant, marginBottom: metrics.spacing.xs },
    });

    return (
        <View style={styles.filtersContainer}>
            {/* WIERSZ 1 */}
            <View style={styles.filterRow}>
                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Filtruj po nazwie
                    </AppText>
                    <AppTextInput
                        placeholder="Wyszukaj"
                        value={search}
                        onChangeText={onSearchChange}
                        fullWidth
                    />
                </View>

                <AppDateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    label="Zakres daty wystawienia"
                    width="100%"
                    style={styles.filterColumn2}
                    startError={dateError ?? undefined}
                    endError={dateError ?? undefined}
                />

                <AppDateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    label="Zakres daty opłacenia"
                    width="100%"
                    style={styles.filterColumn2}
                    startError={dateError ?? undefined}
                    endError={dateError ?? undefined}
                />
            </View>

            {/* WIERSZ 2 */}
            <View style={styles.filterRow}>
                <View style={styles.filterColumn1}>
                    <AppDropdown
                        label="Status"
                        fullWidth
                        value={status}
                        onChange={handleStatusChange}
                        options={[
                            { label: 'Wszystkie', value: InvoiceStatus.ALL },
                            { label: 'Wysłane', value: InvoiceStatus.SENT },
                            { label: 'Opłacone', value: InvoiceStatus.PAID },
                            { label: 'Przeterminowane', value: InvoiceStatus.OVERDUE },
                            { label: 'Anulowane', value: InvoiceStatus.CANCELLED },
                        ]}
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppDropdown
                        label="Sortuj według"
                        value={sortBy}
                        onChange={onSortByChange}
                        fullWidth
                        options={[
                            { label: 'Data wystawienia ↓', value: 'ISSUED_DESC' },
                            { label: 'Data wystawienia ↑', value: 'ISSUED_ASC' },
                            { label: 'Data opłacenia ↓', value: 'PAYMENT_DESC' },
                            { label: 'Data opłacenia ↑', value: 'PAYMENT_ASC' },
                            { label: 'Kwota ↓', value: 'AMOUNT_DESC' },
                            { label: 'Kwota ↑', value: 'AMOUNT_ASC' },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};
