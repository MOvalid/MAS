import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppDrawer } from '../common/AppDrawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { metrics } from '../../theme/metrics';

import HomeScreen from './HomeScreen';
import ClientScreen from './ClientScreen';
import ProductScreen from './ProductScreen';
import AuthScreen from './AuthScreen';
import OrderScreen from './OrderScreen';
import InvoiceScreen from './InvoiceScreen';
import MagazineScreen from './MagazineScreen';
import AppHeader from '../common/AppHeader';

export const MainScreen: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('home');
  const theme = useTheme();

  const navigationItems = [
    { label: 'Strona główna', icon: 'home-outline', route: 'home' },
    { label: 'Klienci', icon: 'account-outline', route: 'client' },
    { label: 'Produkty', icon: 'grid', route: 'product' },
    { label: 'Zamówienia', icon: 'cart-outline', route: 'order' },
    { label: 'Faktury', icon: 'clipboard-text-outline', route: 'invoice' },
    { label: 'Magazyn', icon: 'warehouse', route: 'magazine' },
  ];

  const renderContent = () => {
    switch (activeRoute) {
      case 'home':
        return <HomeScreen />;
      case 'client':
        return <ClientScreen />;
      case 'product':
        return <AuthScreen />;
      case 'order':
        return <OrderScreen />;
      case 'invoice':
        return <InvoiceScreen />;
      case 'magazine':
        return <MagazineScreen />;
      default:
        return <Text>Nie znaleziono ekranu</Text>;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.drawerContainer,
          {
            backgroundColor: theme.colors.surface,
            borderRightColor: theme.colors.outline,
          },
        ]}
      >
        <AppDrawer
          navigationItems={navigationItems}
          activeRoute={activeRoute}
          onNavigate={setActiveRoute}
        />
      </View>

      <View style={styles.mainArea}>
        <AppHeader />

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {renderContent()}
          </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerContainer: {
    width: 250,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: metrics.spacing.lg,
  },
});

export default MainScreen;
