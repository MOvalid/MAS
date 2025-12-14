import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '../common';

type ErrorScreenProps = {
    title?: string;
    message?: string;
    details?: string;
    onRetry?: () => void;
    onGoBack?: () => void;
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
    title = 'Coś poszło nie tak',
    message = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
    details,
    onRetry,
    onGoBack,
}) => {
    const theme = useTheme();
    const handleRetry = () => {
        console.log('RETRY...');
        onRetry?.();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.errorContainer }]}>
                <Icon source={IconName.error} size={48} color={theme.colors.onErrorContainer} />
            </View>

            <AppText variant="headlineSmall" style={styles.title}>
                {title}
            </AppText>

            <AppText variant="bodyLarge" style={styles.message}>
                {message}
            </AppText>

            {details && (
                <View style={styles.detailsBox}>
                    <AppText variant="bodySmall" style={styles.details}>
                        {details}
                    </AppText>
                </View>
            )}

            <View style={styles.actions}>
                {onRetry && (
                    <AppButton mode="contained" icon={IconName.refresh} onPress={handleRetry}>
                        Spróbuj ponownie
                    </AppButton>
                )}

                {onGoBack && (
                    <AppButton mode="outlined" icon={IconName.back} onPress={onGoBack}>
                        Wróć
                    </AppButton>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: metrics.spacing.xl,
    },
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: metrics.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: metrics.spacing.lg,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        textAlign: 'center',
        marginBottom: metrics.spacing.md,
        maxWidth: 480,
    },
    detailsBox: {
        backgroundColor: '#f4f4f4',
        padding: metrics.spacing.smd,
        borderRadius: metrics.radius.md,
        marginBottom: metrics.spacing.lg,
        maxWidth: 520,
    },
    details: {
        textAlign: 'center',
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: metrics.spacing.smd,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});
