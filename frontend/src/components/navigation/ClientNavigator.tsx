// src/components/navigation/ClientNavigator.tsx

import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { ClientStackParamList } from '@/types/navigation';
import {
    ClientAddScreen,
    ClientDetailsScreen,
    ClientEditScreen,
    ClientListScreen,
} from '../screens/client';

const Stack = createNativeStackNavigator<ClientStackParamList>();

const withScreenWrapper = <RouteName extends keyof ClientStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<ClientStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<ClientStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

export const ClientNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ClientList" component={withScreenWrapper(ClientListScreen)} />
            <Stack.Screen name="ClientAdd" component={withScreenWrapper(ClientAddScreen)} />
            <Stack.Screen name="ClientEdit" component={withScreenWrapper(ClientEditScreen)} />
            <Stack.Screen name="ClientDetails" component={withScreenWrapper(ClientDetailsScreen)} />
        </Stack.Navigator>
    );
};
