// src/components/navigation/CustomerNavigator.tsx

import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { CustomerStackParamList } from '@/types/navigation';
import { CustomerAddEditScreen, CustomerDetailsScreen } from '../screens/customer';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

const withScreenWrapper = <RouteName extends keyof CustomerStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<CustomerStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<CustomerStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

const screens = [
    { name: 'CustomerAdd' as const, component: CustomerAddEditScreen },
    { name: 'CustomerEdit' as const, component: CustomerAddEditScreen },
    { name: 'CustomerDetails' as const, component: CustomerDetailsScreen },
] as const;

export const CustomerNavigator = () => {
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
