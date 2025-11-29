export type DrawerParamList = {
    Home: undefined;
    Client: undefined;
    Product: undefined;
    Auth: undefined;
    Order: undefined;
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
