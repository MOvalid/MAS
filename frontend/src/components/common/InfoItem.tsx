import React from 'react';
import { View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { AppText } from './AppText'; // upewnij się, że ścieżka jest poprawna
import { metrics } from '@/theme/metrics';

interface InfoItemProps {
    label: string;
    value: string | number | React.ReactNode;
    valueStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value, valueStyle, containerStyle }) => {
    return (
        <View style={[styles.infoRow, containerStyle]}>
            <AppText variant="bodyLarge" style={styles.label}>
                {label}:
            </AppText>
            <AppText variant="bodyLarge" style={[styles.value, valueStyle]}>
                {value ?? '-'}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        marginBottom: metrics.spacing.xs,
    },
    label: {
        flex: 1,
        fontWeight: '600',
        color: '#444',
    },
    value: {
        flex: 3,
    },
});
