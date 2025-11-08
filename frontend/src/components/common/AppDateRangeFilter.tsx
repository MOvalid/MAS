import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';
import { AppDatePicker } from './AppDatePicker';

interface AppDateRangeFilterProps {
    label?: string;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    style?: ViewStyle;
    width?: string | number;
}

export const AppDateRangeFilter: React.FC<AppDateRangeFilterProps> = ({
    label = 'Okres',
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    style,
    width = '30%',
}) => {
    return (
        <View style={[styles.container, { width: width as DimensionValue }, style]}>
            <View style={styles.labelContainer}>
                <AppText align="center" variant="bodyLarge">
                    {label}
                </AppText>
            </View>

            <View style={styles.inputContainer}>
                <AppDatePicker value={startDate} onChange={onStartDateChange} placeholder="od" />
            </View>

            <View style={styles.inputContainer}>
                <AppDatePicker value={endDate} onChange={onEndDateChange} placeholder="do" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.sm,
    },
    labelContainer: {
        flexBasis: '20%',
    },
    inputContainer: {
        flexBasis: '40%',
    },
});
