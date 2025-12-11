import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTableCell } from './AppTableCell';
import { useAppTheme } from '../../../theme/AppThemeContext';
import { metrics } from '../../../theme/metrics';
import { TableColumn } from './AppTable';

interface AppTableHeaderProps<T> {
    columns: TableColumn<T>[];
    hasActions?: boolean;
}

export const AppTableHeader = <T,>({ columns, hasActions }: AppTableHeaderProps<T>) => {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                styles.headerRow,
                {
                    backgroundColor: colors.secondaryContainer,
                    borderColor: colors.outlineVariant ?? colors.outline,
                },
            ]}
        >
            {columns.map((col) => (
                <AppTableCell
                    key={col.key}
                    content={col.title}
                    variant="header"
                    align={col.align ?? 'left'}
                    flex={col.flex ?? 1}
                />
            ))}

            {hasActions && <AppTableCell content="" variant="header" flex={1} align="center" />}
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: metrics.radius.md,
        borderWidth: 1,
        paddingVertical: metrics.table.cellPaddingY,
        paddingHorizontal: metrics.table.cellPaddingX,
        marginBottom: metrics.spacing.xs,
    },
});
