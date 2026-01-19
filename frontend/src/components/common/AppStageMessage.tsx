import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { AppButton, AppText, IconName } from '../common';

type StateVariant = 'error' | 'info' | 'success';

type AppStateMessageProps = {
    variant?: StateVariant;
    icon?: string;
    title: string;
    message?: string;
    onPrimaryAction?: () => void;
    primaryActionLabel?: string;
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
    style?: ViewStyle;
};

export const AppStateMessage: React.FC<AppStateMessageProps> = ({
    variant = 'error',
    icon,
    title,
    message,
    onPrimaryAction,
    primaryActionLabel = 'Spróbuj ponownie',
    onSecondaryAction,
    secondaryActionLabel = 'Wróć',
    style,
}) => {
    const theme = useTheme();

    const getVariantColors = () => {
        switch (variant) {
            case 'success':
                return { bg: theme.colors.primaryContainer, icon: theme.colors.onPrimaryContainer };
            case 'info':
                return {
                    bg: theme.colors.secondaryContainer,
                    icon: theme.colors.onSecondaryContainer,
                };
            case 'error':
            default:
                return { bg: theme.colors.errorContainer, icon: theme.colors.onErrorContainer };
        }
    };

    const colors = getVariantColors();

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.bg }]}>
                <Icon
                    source={icon || (variant === 'error' ? IconName.error : IconName.info)}
                    size={48}
                    color={colors.icon}
                />
            </View>

            <AppText variant="headlineSmall" style={styles.title}>
                {title}
            </AppText>

            {message && (
                <AppText variant="bodyLarge" style={styles.message}>
                    {message}
                </AppText>
            )}

            <View style={styles.actions}>
                {onPrimaryAction && (
                    <AppButton mode="contained" onPress={onPrimaryAction} style={styles.button}>
                        {primaryActionLabel}
                    </AppButton>
                )}

                {onSecondaryAction && (
                    <AppButton mode="outlined" onPress={onSecondaryAction} style={styles.button}>
                        {secondaryActionLabel}
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
        width: 80,
        height: 80,
        borderRadius: metrics.radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: metrics.spacing.lg,
    },
    title: {
        textAlign: 'center',
        marginBottom: metrics.spacing.xs,
        fontWeight: '600',
    },
    message: {
        textAlign: 'center',
        marginBottom: metrics.spacing.xl,
        opacity: 0.7,
        maxWidth: '80%',
    },
    actions: {
        flexDirection: 'column',
        gap: metrics.spacing.md,
        width: '100%',
        maxWidth: 300,
    },
    button: {
        width: '100%',
    },
});

export const ErrorMessage = ({
    error,
    onRetry,
    onBack,
}: {
    error?: string;
    onRetry?: () => void;
    onBack: () => void;
}) => (
    <AppStateMessage
        variant="error"
        title="Wystąpił błąd"
        message={error || 'Nie udało się pobrać danych. Spróbuj ponownie później.'}
        onPrimaryAction={onRetry}
        primaryActionLabel="Odśwież"
        onSecondaryAction={onBack}
        secondaryActionLabel="Wróć do poprzedniej strony"
    />
);

export const NotFoundMessage = ({
    title = 'Nie znaleziono',
    message = 'Szukany obiekt nie istnieje w bazie danych.',
    onBack,
}: {
    title?: string;
    message?: string;
    onBack: () => void;
}) => (
    <AppStateMessage
        variant="info"
        icon={IconName.search}
        title={title}
        message={message}
        onPrimaryAction={onBack}
        primaryActionLabel="Powrót do listy"
    />
);
