import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { AppLogo } from './AppLogo';
import { AppDrawerButton } from './AppDrawerButton';

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
    <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
      <View style={styles.header}>
        <AppLogo width={150} height={150} />
      </View>

      <Drawer.Section style={[styles.drawerSection]} theme={theme}>
        {navigationItems.map((item) => (
          <AppDrawerButton
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
    borderRightWidth: 0,
  },
  header: {
    alignItems: 'center',
  },
  drawerSection: {
    // marginTop: 8,
    outlineWidth: 0
  },
});
