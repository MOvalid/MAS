// src/components/navigation/ClientNavigator.tsx

import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { ClientStackParamList } from '@/types/navigation';
import { ClientDetailsScreen, ClientAddEditScreen, ClientListScreen } from '../screens/client';
import { CompanyDetailsScreen } from '../screens/company/CompanyDetailsScreen';

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

const screens = [{ name: 'ClientList' as const, component: ClientListScreen }] as const;

export const ClientNavigator = () => {
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
