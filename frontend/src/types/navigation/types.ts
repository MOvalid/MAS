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
    Company: {
        screen?: keyof CompanyStackParamList;
        params?: CompanyStackParamList[keyof CompanyStackParamList];
    };
    Customer: {
        screen?: keyof CustomerStackParamList;
        params?: CustomerStackParamList[keyof CustomerStackParamList];
    };
    Auth: undefined;
    Order: {
        screen?: keyof OrderStackParamList;
        params?: OrderStackParamList[keyof OrderStackParamList];
    };
    Stock: {
        screen?: keyof StockStackParamList;
        params?: StockStackParamList[keyof StockStackParamList];
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
};

export type CompanyStackParamList = {
    CompanyAdd: undefined;
    CompanyEdit: { id: string };
    CompanyDetails: { id: string };
};

export type CustomerStackParamList = {
    CustomerAdd: undefined;
    CustomerEdit: { id: string };
    CustomerDetails: { id: string };
};

export type OrderStackParamList = {
    OrderList: undefined;
    OrderAdd: undefined;
    OrderEdit: { id: string };
    OrderDetails: { id: string };
};

export type StockStackParamList = {
    OrderList: undefined;
};
