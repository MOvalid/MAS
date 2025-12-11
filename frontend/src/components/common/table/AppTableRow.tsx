import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { AppText } from '../../common/AppText';

interface TableColumn {
    key: string;
    title: string;
    width?: string | number;
}

interface AppTableRowProps {
    item: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    columns: TableColumn[];
}

export const AppTableRow: React.FC<AppTableRowProps> = ({ item, columns }) => {
    return (
        <View style={styles.row}>
            {columns.map((col) => (
                <AppText key={col.key} style={[{ width: (col.width as DimensionValue) || 'auto' }]}>
                    {item[col.key]}
                </AppText>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
