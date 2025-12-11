// src/components/navigation/OrderNavigator.tsx

import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { OrderStackParamList } from '@/types/navigation';
import { OrderAddEditScreen, OrderDetailsScreen, OrderListScreen } from '../screens/order';

const Stack = createNativeStackNavigator<OrderStackParamList>();

const withScreenWrapper = <RouteName extends keyof OrderStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<OrderStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<OrderStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

export const OrderNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="OrderList" component={withScreenWrapper(OrderListScreen)} />
            <Stack.Screen name="OrderAdd" component={withScreenWrapper(OrderAddEditScreen)} />
            <Stack.Screen name="OrderEdit" component={withScreenWrapper(OrderAddEditScreen)} />
            <Stack.Screen name="OrderDetails" component={withScreenWrapper(OrderDetailsScreen)} />
        </Stack.Navigator>
    );
};
