import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTableCell } from './AppTableCell';
import { useAppTheme } from '../../../theme/AppThemeContext';
import { metrics } from '../../../theme/metrics';

export interface TableColumn {
    key: string;
    title: string;
    align?: 'left' | 'center' | 'right';
    flex?: number;
}

interface AppTableHeaderProps {
    columns: TableColumn[];
    hasActions?: boolean;
}

export const AppTableHeader: React.FC<AppTableHeaderProps> = ({ columns }) => {
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
                    text={col.title}
                    variant="header"
                    align={col.align ?? 'left'}
                    flex={col.flex ?? 1}
                />
            ))}
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
