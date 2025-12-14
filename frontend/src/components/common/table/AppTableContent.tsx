import React from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { AppTableCell } from './AppTableCell';
import { useAppTheme } from '../../../context/AppThemeContext';
import { metrics } from '../../../theme/metrics';
import AppTableRowActions from './AppTableRowActions';
import { IconValue } from '../icons';
import { TableColumn } from './AppTable';

interface Action {
    icon: IconValue;
    onPress: () => void;
    iconColor?: string;
}

interface AppTableContentProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: (row: T) => Action[];
    onRowPress?: (row: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppTableContent = <T extends Record<string, any>>({
    columns,
    data,
    actions,
    onRowPress,
}: AppTableContentProps<T>) => {
    const { colors } = useAppTheme();

    return (
        <ScrollView>
            {data.map((row, index) => (
                <Pressable
                    key={index}
                    onPress={() => onRowPress?.(row)}
                    style={[
                        styles.row,
                        {
                            backgroundColor: colors.secondaryContainer,
                            borderColor: colors.outlineVariant ?? colors.outline,
                        },
                    ]}
                >
                    {columns.map((col) => (
                        <AppTableCell
                            key={col.key}
                            content={col.render ? col.render(row) : String(row[col.key] ?? '—')}
                            flex={col.flex ?? 1}
                            align={col.align ?? 'left'}
                            variant="cell"
                        />
                    ))}

                    {actions && <AppTableRowActions actions={actions(row)} />}
                </Pressable>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: metrics.table.cellPaddingY,
        paddingHorizontal: metrics.table.cellPaddingX,
        borderRadius: metrics.radius.md,
        borderWidth: 1,
        marginBottom: metrics.spacing.md,
    },
});
