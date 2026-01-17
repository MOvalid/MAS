import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppDropdown, AppTextInput, AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useTheme } from 'react-native-paper';
import { ProductSortOption } from '@/types/common';

interface CategoryOption {
    id: string;
    name: string;
}

interface Props {
    search: string;
    onSearchChange: (v: string) => void;

    category: string;
    categories: CategoryOption[];
    categoriesLoading?: boolean;
    onCategoryChange: (v: string) => void;

    manufacturer: string;
    onManufacturerChange: (v: string) => void;

    sort: ProductSortOption;
    onSortChange: (v: ProductSortOption) => void;
}

export const ProductListFilters: React.FC<Props> = ({
    search,
    onSearchChange,
    category,
    categories,
    categoriesLoading,
    onCategoryChange,
    manufacturer,
    onManufacturerChange,
    sort,
    onSortChange,
}) => {
    const theme = useTheme();

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
        labelText: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: metrics.spacing.xs,
        },
    });

    return (
        <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
                <View style={styles.filterColumn2}>
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

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Kategoria
                    </AppText>
                    <AppDropdown
                        value={category}
                        onChange={(v: string) => onCategoryChange(v)}
                        fullWidth
                        // loading={categoriesLoading}
                        options={categories.map((c) => ({
                            label: c.name,
                            value: c.id,
                        }))}
                    />
                </View>

                <View style={styles.filterColumn1}>
                    <AppText variant="bodyLarge" style={styles.labelText}>
                        Sortowanie
                    </AppText>
                    <AppDropdown
                        value={sort}
                        onChange={(v: string) => onSortChange(v as ProductSortOption)}
                        fullWidth
                        options={[
                            { label: 'Nazwa A → Z', value: 'NAME_ASC' },
                            { label: 'Nazwa Z → A', value: 'NAME_DESC' },
                            { label: 'Producent A → Z', value: 'MANUFACTURER_ASC' },
                            { label: 'Producent Z → A', value: 'MANUFACTURER_DESC' },
                            { label: 'Cena rosnąco', value: 'PRICE_ASC' },
                            { label: 'Cena malejąco', value: 'PRICE_DESC' },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};
