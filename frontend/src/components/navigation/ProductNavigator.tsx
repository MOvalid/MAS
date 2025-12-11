import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { ProductStackParamList } from '@/types/navigation';
import { ProductAddEditScreen, ProductDetailsScreen, ProductListScreen } from '../screens/product';

const Stack = createNativeStackNavigator<ProductStackParamList>();

const withScreenWrapper = <RouteName extends keyof ProductStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<ProductStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<ProductStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

const screens = [
    { name: 'ProductList' as const, component: ProductListScreen },
    { name: 'ProductAdd' as const, component: ProductAddEditScreen },
    { name: 'ProductEdit' as const, component: ProductAddEditScreen },
    { name: 'ProductDetails' as const, component: ProductDetailsScreen },
] as const;

export const ProductNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {screens.map(({ name, component }) => (
                <Stack.Screen key={name} name={name} component={withScreenWrapper(component)} />
            ))}
        </Stack.Navigator>
    );
};
