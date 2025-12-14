import * as React from 'react';
import * as Font from 'expo-font';
import { PaperProvider } from 'react-native-paper';
import { LightTheme, DarkTheme, CombinedDarkTheme, CombinedLightTheme } from './src/theme/theme';
import { AppThemeProvider } from './src/theme/AppThemeContext';
import { SnackbarProvider } from './src/context/SnackbarContext';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';
import AuthScreen from './src/components/screens/AuthScreen';
import {
    ClientNavigator,
    CompanyNavigator,
    CustomerNavigator,
    OrderNavigator,
    ProductNavigator,
    StockNavigator,
} from './src/components/navigation';
import { DrawerParamList } from './src/types/navigation';
import { AuthProvider } from './src/context/AuthContext';

import { HomeScreen, InvoiceScreen } from './src/components/screens';
import { AppDrawerContent, AppScreenWrapper } from './src/components/common';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator<DrawerParamList>();

const linking = {
    prefixes: ['http://localhost:8081'],
    config: {
        screens: {
            Auth: 'auth',
            MainDrawer: {
                path: '',
                screens: {
                    Home: 'home',
                    Client: {
                        path: 'client',
                        screens: {
                            ClientList: '',
                            ClientAdd: 'add',
                            ClientEdit: 'edit/:id',
                            ClientDetails: ':id',
                        },
                    },
                    Company: {
                        path: 'company',
                        screens: {
                            CompanyAdd: 'add',
                            CompanyEdit: 'edit/:id',
                            CompanyDetails: ':id',
                        },
                    },
                    Customer: {
                        path: 'customer',
                        screens: {
                            CustomerAdd: 'add',
                            CustomerEdit: 'edit/:id',
                            CustomerDetails: ':id',
                        },
                    },
                    Product: {
                        path: 'product',
                        screens: {
                            ProductList: '',
                            ProductAdd: 'add',
                            ProductEdit: 'edit/:id',
                            ProductDetails: ':id',
                        },
                    },
                    Order: {
                        path: 'order',
                        screens: {
                            OrderList: '',
                            OrderAdd: 'add',
                            OrderEdit: 'edit/:id',
                            OrderDetails: ':id',
                        },
                    },
                    Invoice: 'invoice',
                    Stock: {
                        path: 'stock',
                        screens: {
                            StockList: '',
                        },
                    },
                },
            },
        },
    },
};

const withScreenWrapper = <RouteName extends keyof DrawerParamList>(
    Component: React.ComponentType<DrawerScreenProps<DrawerParamList, RouteName>>
) => {
    return (props: DrawerScreenProps<DrawerParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <AppDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'permanent',
                drawerStyle: {
                    width: 250,
                },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={withScreenWrapper(HomeScreen)}
                options={{
                    drawerLabel: 'Strona główna',
                    title: 'Strona główna',
                }}
            />
            <Drawer.Screen
                name="Client"
                component={ClientNavigator}
                options={{
                    drawerLabel: 'Klienci',
                    title: 'Klienci',
                }}
            />
            <Drawer.Screen
                name="Company"
                component={CompanyNavigator}
                options={{
                    drawerLabel: 'Firmy',
                    title: 'Firmy',
                }}
            />
            <Drawer.Screen
                name="Customer"
                component={CustomerNavigator}
                options={{
                    drawerLabel: 'Klienci indywidualni',
                    title: 'Klienci indywidualni',
                }}
            />
            <Drawer.Screen
                name="Product"
                component={ProductNavigator}
                listeners={({ navigation }) => ({
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Product', {
                            screen: 'ProductList',
                        });
                    },
                })}
                options={{
                    drawerLabel: 'Produkty',
                    title: 'Produkty',
                }}
            />
            <Drawer.Screen
                name="Order"
                component={OrderNavigator}
                options={{
                    drawerLabel: 'Zamówienia',
                    title: 'Zamówienia',
                }}
            />
            <Drawer.Screen
                name="Auth"
                component={withScreenWrapper(AuthScreen)}
                options={{
                    drawerLabel: 'Autoryzacja',
                    title: 'Autoryzacja',
                }}
            />
            <Drawer.Screen
                name="Invoice"
                component={withScreenWrapper(InvoiceScreen)}
                options={{
                    drawerLabel: 'Faktury',
                    title: 'Faktury',
                }}
            />
            <Drawer.Screen
                name="Stock"
                component={StockNavigator}
                options={{
                    drawerLabel: 'Stan magazynowy',
                    title: 'Stan magazynowy',
                }}
            />
        </Drawer.Navigator>
    );
}

export default function App() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const paperTheme = isDark ? DarkTheme : LightTheme;
    const navigationTheme = isDark ? CombinedDarkTheme : CombinedLightTheme;
    const [fontsLoaded, setFontsLoaded] = React.useState(false);

    React.useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'ITC Benguiat': require('./assets/fonts/ITCBenguiat.ttf'),
                'Work Sans': require('./assets/fonts/WorkSans.ttf'),
            });
            setFontsLoaded(true);
        };
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <PaperProvider theme={paperTheme}>
                <SnackbarProvider>
                    <AppThemeProvider>
                        <NavigationContainer
                            theme={navigationTheme as unknown as Theme}
                            linking={linking}
                            documentTitle={{
                                formatter: (options, route) =>
                                    `${options?.title ?? route?.name} - MAS`,
                            }}
                        >
                            <Stack.Navigator
                                initialRouteName="MainDrawer"
                                screenOptions={{ headerShown: false }}
                            >
                                <Stack.Screen name="Auth" component={AuthScreen} />
                                <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </AppThemeProvider>
                </SnackbarProvider>
            </PaperProvider>
        </AuthProvider>
    );
}
