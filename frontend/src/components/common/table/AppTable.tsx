// src/components/common/table/AppTable.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { useAppTheme } from '../../../theme/AppThemeContext';
import { metrics } from '../../../theme/metrics';
import { AppTableHeader } from './AppTableHeader';
import { AppTableContent } from './AppTableContent';
import { IconValue } from '../icons';

interface TableColumn {
    key: string;
    title: string;
    align?: 'left' | 'center' | 'right';
    flex?: number;
}

interface ActionButton {
    icon: IconValue;
    onPress: () => void;
    iconColor?: string;
    label?: string;
}

interface AppTableProps<T> {
    title?: string;
    columns: TableColumn[];
    data: T[];
    onRowPress?: (row: T) => void;
    actions?: (row: T) => ActionButton[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppTable = <T extends Record<string, any>>({
    title,
    columns,
    data,
    onRowPress,
    actions,
}: AppTableProps<T>) => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            {title ? (
                <AppText
                    variant="headlineSmall"
                    style={[styles.tableTitle, { color: colors.onSurface }]}
                >
                    {title}
                </AppText>
            ) : null}

            <AppTableHeader
                columns={actions ? [...columns, { key: '_actions', title: '' }] : columns}
            />

            <AppTableContent
                columns={columns}
                data={data}
                onRowPress={onRowPress}
                actions={actions}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: metrics.spacing.sm,
    },
    tableTitle: {
        marginBottom: metrics.spacing.smd,
    },
});
