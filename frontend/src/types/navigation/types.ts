import { MaterialCommunityIconName } from '@/components/common/AppDrawerButton';
import { JSX } from 'react';

export type NavigationConfigItem = {
    name: string;
    label: string;
    icon: MaterialCommunityIconName;
    initialScreen?: () => JSX.Element;
};

export type NavigationConfig = NavigationConfigItem[];

export type DrawerParamList = {
    Home: undefined;
    Product: {
        screen?: keyof ProductStackParamList;
        params?: ProductStackParamList[keyof ProductStackParamList];
    };
    Client: {
        screen?: keyof ClientStackParamList;
        params?: ClientStackParamList[keyof ClientStackParamList];
    };
    Auth: undefined;
    Order: {
        screen?: keyof OrderStackParamList;
        params?: OrderStackParamList[keyof OrderStackParamList];
    };
    Invoice: undefined;
    Magazine: undefined;
};

export type ProductStackParamList = {
    ProductList: undefined;
    ProductAdd: undefined;
    ProductEdit: { id: string };
    ProductDetails: { id: string };
};

export type ClientStackParamList = {
    ClientList: undefined;
    ClientAdd: undefined;
    ClientEdit: { id: string };
    ClientDetails: { id: string };
};

export type OrderStackParamList = {
    OrderList: undefined;
    OrderAdd: undefined;
    OrderEdit: { id: string };
    OrderDetails: { id: string };
};
