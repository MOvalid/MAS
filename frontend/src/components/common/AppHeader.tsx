import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Menu, Avatar, Text, useTheme } from 'react-native-paper';
import AppIconButton from './AppIconButton';
import { metrics } from '../../theme/metrics';

type Language = 'PL' | 'EN' | 'DE'

const AppHeader = () => {
  const [languageMenuVisible, setLanguageMenuVisible] = React.useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>('PL');
  const currentUser = 'Jan Kowalski';

  const theme = useTheme();

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguageMenuVisible(false);
  };

  const handleNotifications = () => {
    console.log('Powiadomienia');
  };

  const handleFAQ = () => {
    console.log('FAQ');
  };

  const handleSettings = () => {
    console.log('Ustawienia');
  };

  const handleLogout = () => {
    console.log('Wyloguj');
  };

  return (
    <Appbar.Header
        elevated
        style={[styles.header, { backgroundColor: theme.colors.primary }]}
    >
      <Appbar.Content title="" />
      
      <View style={styles.rightContainer}>
        {/* Wybór języka */}
        <Menu
          visible={languageMenuVisible}
          onDismiss={() => setLanguageMenuVisible(false)}
          anchor={
            <AppIconButton
              icon="translate"
              size={24}
              iconColor={theme.colors.surface}
              onPress={() => setLanguageMenuVisible(true)}
            />
          }
        >
          <Menu.Item 
            onPress={() => handleLanguageChange('PL')} 
            title="Polski" 
            leadingIcon={currentLanguage === 'PL' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => handleLanguageChange('EN')} 
            title="English"
            leadingIcon={currentLanguage === 'EN' ? 'check' : undefined}
          />
          <Menu.Item 
            onPress={() => handleLanguageChange('DE')} 
            title="Deutsch"
            leadingIcon={currentLanguage === 'DE' ? 'check' : undefined}
          />
        </Menu>

        <AppIconButton
          icon="bell-outline"
          size={24}
          badge="5"
          iconColor={theme.colors.surface}
          onPress={handleNotifications}
        />

        <AppIconButton
          icon="help-circle-outline"
          size={24}
          iconColor={theme.colors.surface}
          onPress={handleFAQ}
        />

        <AppIconButton
          icon="cog-outline"
          size={24}
          iconColor={theme.colors.surface}
          onPress={handleSettings}
        />

        <AppIconButton
          icon="logout"
          size={24}
          iconColor={theme.colors.surface}
          onPress={handleLogout}
        />
      </View>

        <View style={styles.userInfo}>
        {/* <Avatar.Text 
            size={32} 
            label={currentUser.split(' ').map(n => n[0]).join('')} 
            style={{ backgroundColor: theme.colors.secondary }}
            color={theme.colors.onPrimary}
        /> */}
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
    fontWeight: '500',
  },
});

export default AppHeader;
