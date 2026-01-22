import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppText } from './../common/AppText';
import { metrics } from '../../theme/metrics';

interface BreadcrumbItem {
    label: string;
    screen?: string;
    nested?: string;
}

interface BreadcrumbConfig {
    [key: string]: BreadcrumbItem;
}

const breadcrumbConfig: BreadcrumbConfig = {
    Home: { label: 'Strona główna' },

    // Klienci
    Customer: { label: 'Klienci' },
    CustomerList: { label: 'Lista klientów', screen: 'Customer', nested: 'CustomerList' },
    CustomerAdd: { label: 'Dodanie klienta', screen: 'Customer', nested: 'CustomerAdd' },
    CustomerEdit: { label: 'Edycja klienta', screen: 'Customer', nested: 'CustomerEdit' },
    CustomerDetails: { label: 'Szczegóły klienta', screen: 'Customer', nested: 'CustomerDetails' },

    // Firmy
    Company: { label: 'Firmy' },
    CompanyList: { label: 'Lista firm', screen: 'Company', nested: 'CompanyList' },
    CompanyAdd: { label: 'Dodanie firmy', screen: 'Company', nested: 'CompanyAdd' },
    CompanyEdit: { label: 'Edycja firmy', screen: 'Company', nested: 'CompanyEdit' },
    CompanyDetails: { label: 'Szczegóły firmy', screen: 'Company', nested: 'CompanyDetails' },

    // Produkty
    Product: { label: 'Produkty' },
    ProductList: { label: 'Lista produktów', screen: 'Product', nested: 'ProductList' },
    ProductAdd: { label: 'Dodanie produktu', screen: 'Product', nested: 'ProductAdd' },
    ProductEdit: { label: 'Edycja produktu', screen: 'Product', nested: 'ProductEdit' },
    ProductDetails: { label: 'Szczegóły produktu', screen: 'Product', nested: 'ProductDetails' },

    // Zamówienia
    Order: { label: 'Zamówienia' },
    OrderList: { label: 'Lista zamówień', screen: 'Order', nested: 'OrderList' },
    OrderAdd: { label: 'Dodanie zamówienia', screen: 'Order', nested: 'OrderAdd' },
    OrderEdit: { label: 'Edycja zamówienia', screen: 'Order', nested: 'OrderEdit' },
    OrderDetails: { label: 'Szczegóły zamówienia', screen: 'Order', nested: 'OrderDetails' },

    // Faktury
    Invoice: { label: 'Faktury' },

    // Magazyn
    Stock: { label: 'Magazyn' },
    StockList: { label: 'Stan magazynowy', screen: 'Stock', nested: 'StockList' },
};

export const AppBreadcrumb = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const generateBreadcrumbs = (): Array<{ label: string; onPress?: () => void }> => {
        const breadcrumbs: Array<{ label: string; onPress?: () => void }> = [];

        breadcrumbs.push({
            label: 'Strona główna',
            onPress: () => navigation.navigate('Home'),
        });

        const mainRouteName = route.name;
        const nestedState = route.state;

        console.log('Main route:', mainRouteName);
        console.log('Nested state:', nestedState);

        if (!nestedState) {
            const config = breadcrumbConfig[mainRouteName];
            if (config && mainRouteName !== 'Home') {
                breadcrumbs.push({
                    label: config.label,
                });
            }
            return breadcrumbs;
        }

        const mainConfig = breadcrumbConfig[mainRouteName];
        if (mainConfig) {
            breadcrumbs.push({
                label: mainConfig.label,
                onPress: () => navigation.navigate(mainRouteName),
            });
        }

        const nestedRoutes = nestedState.routes || [];
        const currentNestedRoute = nestedRoutes[nestedState.index || 0];

        if (currentNestedRoute) {
            console.log('Nested route:', currentNestedRoute.name);
            const nestedConfig = breadcrumbConfig[currentNestedRoute.name];
            if (nestedConfig) {
                breadcrumbs.push({
                    label: nestedConfig.label,
                });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    console.log('Generated breadcrumbs:', breadcrumbs);

    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <View style={styles.container}>
            {breadcrumbs.map((crumb: { label: string; onPress?: () => void }, index: number) => (
                <View key={`${crumb.label}-${index}`} style={styles.breadcrumbItem}>
                    {index === breadcrumbs.length - 1 ? (
                        <AppText variant="bodyMedium" style={styles.currentCrumb}>
                            {crumb.label}
                        </AppText>
                    ) : (
                        <>
                            {crumb.onPress ? (
                                <TouchableOpacity onPress={crumb.onPress}>
                                    <AppText variant="bodyMedium" style={styles.crumbLink}>
                                        {crumb.label}
                                    </AppText>
                                </TouchableOpacity>
                            ) : (
                                <AppText variant="bodyMedium" style={styles.currentCrumb}>
                                    {crumb.label}
                                </AppText>
                            )}
                            <AppText variant="bodyMedium" style={styles.separator}>
                                {' / '}
                            </AppText>
                        </>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: metrics.spacing.md,
        paddingHorizontal: metrics.spacing.md,
    },
    breadcrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crumbLink: {
        color: '#0066CC',
    },
    currentCrumb: {
        color: '#666666',
    },
    separator: {
        color: '#999999',
        marginHorizontal: metrics.spacing.xs,
    },
});
