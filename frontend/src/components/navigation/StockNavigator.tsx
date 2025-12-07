import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreenWrapper } from '../common';
import { StockStackParamList } from '@/types/navigation';
import { StockListScreen } from '../screens/stock';

const Stack = createNativeStackNavigator<StockStackParamList>();

const withScreenWrapper = <RouteName extends keyof StockStackParamList>(
    Component: React.ComponentType<NativeStackScreenProps<StockStackParamList, RouteName>>
) => {
    return (props: NativeStackScreenProps<StockStackParamList, RouteName>) => (
        <AppScreenWrapper>
            <Component {...props} />
        </AppScreenWrapper>
    );
};

const screens = [{ name: 'StockList' as const, component: StockListScreen }] as const;

export const StockNavigator = () => {
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
