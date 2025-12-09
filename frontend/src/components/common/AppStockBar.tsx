// AppStockBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';

interface AppStockBarProps {
    stockQuantity: number;
    maxQuantity?: number;
    height?: number;
}

const COLORS = {
    empty: '#E53935',
    low: '#FB8C00',
    medium: '#FDD835',
    high: '#43A047',
    background: '#EEE',
};

const getStockColor = (qty: number) => {
    if (qty === 0) return COLORS.empty;
    if (qty < 30) return COLORS.low;
    if (qty < 100) return COLORS.medium;
    return COLORS.high;
};

export const AppStockBar: React.FC<AppStockBarProps> = ({
    stockQuantity,
    maxQuantity = 200,
    height = 6,
}) => {
    const percentage = Math.min((stockQuantity / maxQuantity) * 100, 100);

    return (
        <View style={[styles.container, { height }]}>
            <View
                style={[
                    styles.bar,
                    { width: `${percentage}%`, backgroundColor: getStockColor(stockQuantity) },
                ]}
            />
            <AppText align="center" variant="bodySmall">
                {stockQuantity}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        backgroundColor: COLORS.background,
        borderRadius: 4,
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
});
