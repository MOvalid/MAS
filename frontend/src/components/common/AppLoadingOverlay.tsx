// components/common/LoadingOverlay.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AppText } from '@/components/common';
import { metrics } from '@/theme/metrics';

type AppLoadingOverlayProps = {
    visible: boolean;
    text?: string;
};

export const AppLoadingOverlay: React.FC<AppLoadingOverlayProps> = ({
    visible,
    text = 'Ładowanie...',
}) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <AppText style={styles.text}>{text}</AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    card: {
        backgroundColor: 'white',
        padding: metrics.spacing.lg,
        borderRadius: metrics.radius.md,
        alignItems: 'center',
        minWidth: 220,
        elevation: 4,
    },
    text: {
        marginTop: metrics.spacing.md,
        textAlign: 'center',
    },
});
