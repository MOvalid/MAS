import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import {
    AppTextInput,
    AppDateRangeFilter,
    AppDropdown,
    AppText,
    IconName,
} from '@/components/common';
import { AppTooltip } from '@/components/common/AppTooltip';
import { metrics } from '@/theme/metrics';
import { ORDER_SORT_OPTIONS, ORDER_STATUS_LABELS, OrderSort, OrderStatus } from '@/types/common';

interface OrderListFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    status: OrderStatus;
    onStatusChange: (value: OrderStatus) => void;
    seller?: string;
    onSellerChange: (value: string) => void;
    sellerOptions?: { label: string; value: string }[];
    sort: OrderSort;
    onSortChange: (value: OrderSort) => void;
    dateError?: string | null;
}

export const OrderListFilters: React.FC<OrderListFiltersProps> = ({
    search,
    onSearchChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    status,
    onStatusChange,
    seller,
    onSellerChange,
    sellerOptions,
    sort,
    onSortChange: onSortByChange,
    dateError,
}) => {
    const theme = useTheme();

    const statusOptions = useMemo(
        () => [
            ...Object.values(OrderStatus)
                .map((s) => ({
                    label: ORDER_STATUS_LABELS[s],
                    value: s,
                }))
                .sort((a, b) => a.label.localeCompare(b.label, 'pl')),
        ],
        []
    );

    const styles = StyleSheet.create({
        filtersContainer: {
            width: '100%',
            marginBottom: metrics.spacing.md,
            gap: metrics.spacing.md,
        },
        filterRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: metrics.spacing.md,
        },
        filterColumn1: {
            flex: 1,
        },
        filterColumn2: {
            flex: 2,
        },
        labelText: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: metrics.spacing.xs,
        },
        labelWithIcon: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: metrics.spacing.sm,
        },
    });

    return (
        <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
                <View style={styles.filterColumn1}>
                    <View style={styles.labelWithIcon}>
                        <AppText variant="bodyLarge" style={styles.labelText}>
                            Wyszukiwanie
                        </AppText>
                        <AppTooltip content="Szukaj po nazwie, kliencie lub numerze faktury">
                            <Icon
                                source={IconName.help}
                                size={18}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </AppTooltip>
                    </View>
                    <AppTextInput
                        placeholder="Wyszukaj..."
                        value={search}
                        onChangeText={onSearchChange}
                        fullWidth
                    />
                </View>

                <View style={styles.filterColumn2}>
                    <AppDateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                        label="Zakres daty zamówienia"
                        width="100%"
                        style={styles.filterColumn2}
                        startError={dateError ?? undefined}
                        endError={dateError ?? undefined}
                    />
                </View>
            </View>

            <View style={styles.filterRow}>
                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Status
                    </AppText>
                    <AppDropdown
                        value={status}
                        onChange={(v) => onStatusChange(v as OrderStatus)}
                        options={statusOptions}
                        fullWidth
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sprzedawca
                    </AppText>
                    <AppDropdown
                        value={seller}
                        onChange={onSellerChange}
                        options={sellerOptions ?? []}
                        fullWidth
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sortowanie
                    </AppText>
                    <AppDropdown
                        value={sort}
                        onChange={(v) => onSortByChange(v as OrderSort)}
                        options={ORDER_SORT_OPTIONS}
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
};
