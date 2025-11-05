import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { AppLogo } from './AppLogo';
import { AppIconButton } from './AppIconButton';

type AppDrawerProps = {
  navigationItems: {
    label: string;
    icon: string;
    route: string;
  }[];
  activeRoute?: string;
  onNavigate: (route: string) => void;
};

export const AppDrawer: React.FC<AppDrawerProps> = ({
  navigationItems,
  activeRoute,
  onNavigate,
}) => {
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppLogo width={100} height={100} />
      </View>

      <Drawer.Section style={[styles.drawerSection]} theme={theme}>
        {navigationItems.map((item) => (
          <AppIconButton
            key={item.route}
            label={item.label}
            icon={item.icon}
            active={activeRoute === item.route}
            onPress={() => onNavigate(item.route)}
          />
        ))}
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerSection: {
    marginTop: 8,
  },
});
