import React, { useState } from 'react';
import { View, ScrollView, Switch, StyleSheet } from 'react-native';
import { useTheme, Divider, MD3Theme } from 'react-native-paper';
import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useAuth } from '@/context/AuthContext';
import { AppChangePasswordModal } from '../common/AppChangePasswordModal';
import { useSnackbar } from '@/context/SnackbarContext';

const createStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: metrics.spacing.lg,
        },
        header: {
            marginBottom: metrics.spacing.xl,
        },
        section: {
            marginBottom: metrics.spacing.lg,
            backgroundColor: theme.colors.background,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: metrics.spacing.sm,
        },
        settingInfo: {
            flex: 1,
            marginRight: metrics.spacing.md,
        },
        logoutButton: {
            marginTop: metrics.spacing.md,
            borderColor: theme.colors.error,
        },
        sectionTitle: {
            marginBottom: metrics.spacing.md,
        },
        divider: {
            marginVertical: metrics.spacing.sm,
        },
        passwordButton: {
            marginBottom: metrics.spacing.sm,
        },
    });

export const SettingsScreen = () => {
    const theme = useTheme();
    const { signOut } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [lowStockAlert, setLowStockAlert] = useState(true);
    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);

    const styles = createStyles(theme);

    const handlePasswordChange = () => setChangePasswordVisible(true);

    const handleLogout = () => {
        if (signOut) signOut();
        else showSnackbar('Nie udało się wylogować. Spróbuj ponownie za chwilę.', 'warning');
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <AppText variant="headlineMedium">Ustawienia</AppText>
                    <AppText variant="bodyMedium">Zarządzaj swoją aplikacją MAS</AppText>
                </View>

                <AppCard style={styles.section}>
                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Wygląd i interfejs
                    </AppText>
                    <View style={styles.row}>
                        <View style={styles.settingInfo}>
                            <AppText variant="bodyLarge">Tryb ciemny</AppText>
                            <AppText variant="bodySmall">Dostosuj jasność interfejsu</AppText>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                        />
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.row}>
                        <View style={styles.settingInfo}>
                            <AppText variant="bodyLarge">Język aplikacji</AppText>
                            <AppText variant="bodySmall">Obecnie: Polski (PL)</AppText>
                        </View>
                        <AppButton mode="text" compact>
                            Zmień
                        </AppButton>
                    </View>
                </AppCard>

                <AppCard style={styles.section}>
                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Powiadomienia
                    </AppText>
                    <View style={styles.row}>
                        <View style={styles.settingInfo}>
                            <AppText variant="bodyLarge">Powiadomienia push</AppText>
                            <AppText variant="bodySmall">Główne przełącznik powiadomień</AppText>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.row}>
                        <View style={styles.settingInfo}>
                            <AppText variant="bodyLarge">Alerty niskiego stanu</AppText>
                            <AppText variant="bodySmall">Informuj, gdy produkt się kończy</AppText>
                        </View>
                        <Switch value={lowStockAlert} onValueChange={setLowStockAlert} />
                    </View>
                </AppCard>

                <AppCard style={styles.section}>
                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Konto i Bezpieczeństwo
                    </AppText>
                    <AppButton
                        icon={IconName.lock || 'lock'}
                        mode="outlined"
                        onPress={handlePasswordChange}
                        style={styles.passwordButton}
                    >
                        Zmień hasło
                    </AppButton>
                    <AppButton
                        icon={IconName.logout || 'logout'}
                        mode="outlined"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        textColor={theme.colors.error}
                    >
                        Wyloguj się
                    </AppButton>
                </AppCard>
            </ScrollView>

            <AppChangePasswordModal
                visible={isChangePasswordVisible}
                onClose={() => setChangePasswordVisible(false)}
            />
        </>
    );
};
