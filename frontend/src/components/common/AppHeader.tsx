import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Menu, Text, useTheme } from 'react-native-paper';
import AppIconButton from './AppIconButton';
import { metrics } from '../../theme/metrics';
import { IconName } from './icons';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { useNavigation } from '@react-navigation/native';

type Language = 'PL' | 'EN' | 'DE';

export const AppHeader = (): React.JSX.Element => {
    const { signOut, userEmail } = useAuth();
    const [languageMenuVisible, setLanguageMenuVisible] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<Language>('PL');
    const currentUser = userEmail || 'Użytkownik';
    const theme = useTheme();
    const navigation = useNavigation();
    const { showSnackbar } = useSnackbar();

    const handleLanguageChange = (lang: Language) => {
        setCurrentLanguage(lang);
        setLanguageMenuVisible(false);
    };

    const handleNotifications = () => console.log('Powiadomienia');

    const handleFAQ = () => {
        navigation.navigate('FAQ');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };
    const handleLogout = () => {
        if (signOut) signOut();
        else {
            const error = 'Nie udało się wylogować. Spróbuj ponownie za chwilę.';
            showSnackbar(error, 'warning');
        }
    };

    const renderLanguageLabel = () => {
        switch (currentLanguage) {
            case 'PL':
                return 'Polski';
            case 'EN':
                return 'English';
            case 'DE':
                return 'Deutsch';
        }
    };

    return (
        <Appbar.Header elevated style={[styles.header, { backgroundColor: theme.colors.primary }]}>
            <Appbar.Content title="" />

            <View style={styles.rightContainer}>
                {/* <Menu
                    visible={languageMenuVisible}
                    onDismiss={() => setLanguageMenuVisible(false)}
                    anchor={
                        <AppIconButton
                            icon={IconName.translate}
                            size={24}
                            iconColor={theme.colors.surface}
                            onPress={() => setLanguageMenuVisible(true)}
                        />
                    }
                >
                    {(['PL', 'EN', 'DE'] as Language[]).map((lang) => (
                        <Menu.Item
                            key={lang}
                            onPress={() => handleLanguageChange(lang)}
                            title={renderLanguageLabel()}
                            leadingIcon={currentLanguage === lang ? IconName.check : undefined}
                        />
                    ))}
                </Menu> */}
{/* 
                <AppIconButton
                    icon={IconName.notifications}
                    size={24}
                    badge="5"
                    iconColor={theme.colors.surface}
                    onPress={handleNotifications}
                /> */}

                <AppIconButton
                    icon={IconName.help}
                    size={24}
                    iconColor={theme.colors.surface}
                    onPress={handleFAQ}
                />

                {/* <AppIconButton
                    icon={IconName.settings}
                    size={24}
                    iconColor={theme.colors.surface}
                    onPress={handleSettings}
                /> */}

                <AppIconButton
                    icon={IconName.logout}
                    size={24}
                    iconColor={theme.colors.surface}
                    onPress={handleLogout}
                />
            </View>

            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.colors.surface }]}>
                    {currentUser}
                </Text>
            </View>
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.xs,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: metrics.spacing.sm,
        gap: metrics.spacing.sm,
    },
    userName: {
        fontSize: metrics.text.small + 2,
        fontWeight: metrics.fontWeight.regular,
    },
});

export default AppHeader;
