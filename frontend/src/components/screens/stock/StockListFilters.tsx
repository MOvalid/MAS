import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppDropdown, AppTextInput, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useTheme } from 'react-native-paper';
import { StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';

interface StockListFiltersProps {
    search: string;
    onSearchChange: (v: string) => void;
    stockLevel: StockLevelFilter;
    onStockLevelChange: (v: StockLevelFilter) => void;
    sortBy: StockSortOption;
    onSortByChange: (v: StockSortOption) => void;
}

export const StockListFilters: React.FC<StockListFiltersProps> = ({
    search,
    onSearchChange,
    stockLevel,
    onStockLevelChange,
    sortBy,
    onSortByChange,
}) => {
    const theme = useTheme();

    const stockLevelOptions = [
        { label: 'Wszystkie', value: StockLevelFilter.All },
        { label: 'Brak', value: StockLevelFilter.None },
        { label: 'Niska', value: StockLevelFilter.Low },
        { label: 'Średnia', value: StockLevelFilter.Medium },
        { label: 'Wysoka', value: StockLevelFilter.High },
    ];

    const sortOptions = [
        { label: 'Nazwa A → Z', value: StockSortOption.NameAscending },
        { label: 'Nazwa Z → A', value: StockSortOption.NameDescending },
        { label: 'Producent A → Z', value: StockSortOption.ManufacturerAscending },
        { label: 'Producent Z → A', value: StockSortOption.ManufacturerDescending },
        { label: 'Stan rosnąco', value: StockSortOption.StockAscending },
        { label: 'Stan malejąco', value: StockSortOption.StockDescending },
    ];

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
            <View style={styles.filterRow}>
                <View style={styles.filterColumn2}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Filtruj po nazwie
                    </AppText>
                    <AppTextInput
                        placeholder="Wyszukaj produkt"
                        value={search}
                        onChangeValue={onSearchChange}
                        fullWidth
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Poziom stanu
                    </AppText>
                    <AppDropdown
                        options={stockLevelOptions}
                        width="100%"
                        value={stockLevel}
                        onChange={(val) => onStockLevelChange(val as StockLevelFilter)}
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sortuj według
                    </AppText>
                    <AppDropdown
                        options={sortOptions}
                        width="100%"
                        value={sortBy}
                        onChange={(val) => onSortByChange(val as StockSortOption)}
                    />
                </View>
            </View>
        </View>
    );
};
