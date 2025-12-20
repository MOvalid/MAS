import {
    AppTextInput,
    AppDateRangeFilter,
    AppDropdown,
    AppText,
    IconName,
} from '@/components/common';
import { AppTooltip } from '@/components/common/AppTooltip';
import { metrics } from '@/theme/metrics';
import { ORDER_SORT_OPTIONS, ORDER_STATUS_LABELS, OrderStatus } from '@/types/common';
import { OrderSortOption } from '@/types/domain';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

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
    onSellerChange?: (value: string) => void;
    sellerOptions?: { label: string; value: string }[];

    sortBy: OrderSortOption;
    onSortByChange: (value: OrderSortOption) => void;

    dateError?: string | null;
}

export const ORDER_STATUS_DROPDOWN_OPTIONS = [
    ...Object.values(OrderStatus)
        .map((status) => ({
            label: ORDER_STATUS_LABELS[status],
            value: status,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'pl')),
];

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
    sortBy,
    onSortByChange,
    dateError,
}) => {
    const theme = useTheme();

    const handleStatusChange = (value: string) => {
        if (Object.values(OrderStatus).includes(value as OrderStatus)) {
            onStatusChange(value as OrderStatus);
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
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: metrics.spacing.sm,
                        }}
                    >
                        <AppText variant="bodyLarge" style={styles.labelText}>
                            Filtrowanie
                        </AppText>

                        <AppTooltip content="Wyszukuj po nazwie, kliencie lub numerze dokumentu">
                            <Icon
                                source={IconName.help}
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </AppTooltip>
                    </View>

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
                    label="Zakres daty zamówienia"
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
                        options={ORDER_STATUS_DROPDOWN_OPTIONS}
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppDropdown
                        label="Sprzedawca"
                        fullWidth
                        value={seller}
                        onChange={onSellerChange!}
                        options={sellerOptions ?? []}
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppDropdown
                        label="Sortuj według"
                        value={sortBy}
                        onChange={(v) => onSortByChange(v as OrderSortOption)}
                        fullWidth
                        options={ORDER_SORT_OPTIONS}
                    />
                </View>
            </View>
        </View>
    );
};
