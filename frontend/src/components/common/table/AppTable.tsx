// src/components/common/table/AppTable.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '../AppText';
import { useAppTheme } from '../../../context/AppThemeContext';
import { metrics } from '../../../theme/metrics';
import { AppTableHeader } from './AppTableHeader';
import { AppTableContent } from './AppTableContent';
import { IconValue } from '../icons';

export interface TableColumn<T> {
    key: keyof T & string;
    title: string;
    align?: 'left' | 'center' | 'right';
    flex?: number;
    render?: (item: T) => React.ReactNode;
}

interface ActionButton {
    icon: IconValue;
    onPress: () => void;
    iconColor?: string;
    label?: string;
}

interface AppTableProps<T> {
    title?: string;
    columns: TableColumn<T>[];
    data: T[];
    onRowPress?: (row: T) => void;
    actions?: (row: T) => ActionButton[];
    style?: StyleProp<ViewStyle>;
    noDataComponent?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppTable = <T extends Record<string, any>>({
    title,
    columns,
    data,
    onRowPress,
    actions,
    style,
    noDataComponent,
}: AppTableProps<T>) => {
    const { colors } = useAppTheme();
    const hasData = data && data.length > 0;

    return (
        <View style={[styles.container, style]}>
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

            {hasData ? (
                <AppTableContent
                    columns={columns}
                    data={data}
                    onRowPress={onRowPress}
                    actions={actions}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    {noDataComponent ?? (
                        <AppText variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
                            Brak danych
                        </AppText>
                    )}
                </View>
            )}
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
    noDataContainer: {
        paddingVertical: metrics.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
