// src/components/navigation/CompanyNavigator.tsx

import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { CompanyStackParamList } from '@/types/navigation';
import { CompanyAddEditScreen, CompanyDetailsScreen } from '../screens/company';

const Stack = createNativeStackNavigator<CompanyStackParamList>();

const withScreenWrapper = <RouteName extends keyof CompanyStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<CompanyStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<CompanyStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

const screens = [
    { name: 'CompanyAdd' as const, component: CompanyAddEditScreen },
    { name: 'CompanyEdit' as const, component: CompanyAddEditScreen },
    { name: 'CompanyDetails' as const, component: CompanyDetailsScreen },
] as const;

export const CompanyNavigator = () => {
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
