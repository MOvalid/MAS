import { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconName = {
    translate: 'translate',
    check: 'check',
    cancel: 'cancel',
    error: 'alert-circle-outline',
    client: 'account-group',
    seller: 'account-tie',
    document: 'file-document-outline',
    logout: 'logout',
    notifications: 'bell-outline',
    help: 'help-circle-outline',
    settings: 'cog-outline',
    edit: 'pencil',
    download: 'download',
    delete: 'delete',
    camera: 'camera-plus',
    close: 'close-circle',
    payment: 'cash-clock',
    delivery: 'truck-delivery-outline',
    refresh: 'refresh',
    back: 'arrow-u-left-top',
} as const;

export type IconKey = keyof typeof IconName;
export type IconValue = (typeof IconName)[IconKey];

export type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
