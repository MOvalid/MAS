import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { ClientListScreen } from '@/components/screens/client';
import { OrderListScreen } from '@/components/screens/order';
import { ProductListScreen } from '@/components/screens/product';
import { StockListScreen } from '@/components/screens/stock';
import { NavigationConfig } from '@/types/navigation';
import { MaterialCommunityIconName, AppDrawerButton } from './AppDrawerButton';
import { AppLogo } from '..';
import { metrics } from '@/theme/metrics';

export type NavigationConfigItem = {
    name: string;
    label: string;
    icon: MaterialCommunityIconName;
    initialScreen?: string;
};

const navigationConfig: NavigationConfig = [
    { name: 'Home', label: 'Strona główna', icon: 'home-outline' },
    { name: 'Client', label: 'Klienci', icon: 'account-outline', initialScreen: ClientListScreen },
    { name: 'Product', label: 'Produkty', icon: 'grid', initialScreen: ProductListScreen },
    { name: 'Order', label: 'Zamówienia', icon: 'cart-outline', initialScreen: OrderListScreen },
    {
        name: 'Invoice',
        label: 'Faktury',
        icon: 'clipboard-text-outline',
    },
    { name: 'Stock', label: 'Stan magazynowy', icon: 'warehouse', initialScreen: StockListScreen },
];

export const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const theme = useTheme();
    const { state, navigation } = props;

    const activeRouteName = state.routes[state.index]?.name;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.header}>
                <AppLogo width={150} height={150} />
            </View>

            <ScrollView style={styles.scrollView}>
                <Drawer.Section style={styles.drawerSection} theme={theme}>
                    {navigationConfig.map((item) => (
                        <AppDrawerButton
                            key={item.name}
                            label={item.label}
                            icon={item.icon as MaterialCommunityIconName}
                            active={activeRouteName === item.name}
                            onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: item.name,
                                            params: item.initialScreen
                                                ? { screen: item.initialScreen }
                                                : undefined,
                                        },
                                    ],
                                });
                            }}
                        />
                    ))}
                </Drawer.Section>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: metrics.spacing.md,
    },
    scrollView: {
        flex: 1,
    },
    drawerSection: {
        marginTop: metrics.spacing.sm,
    },
});
