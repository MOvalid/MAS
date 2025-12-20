import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AppText } from '../common';
import { metrics } from '@/theme/metrics';

type LoadingScreenProps = {
    text?: string;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ text = 'Ładowanie strony...' }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <AppText style={styles.text}>{text}</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: metrics.spacing.lg,
    },
    text: {
        marginTop: metrics.spacing.md,
        textAlign: 'center',
    },
});
