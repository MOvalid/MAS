import { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconName = {
    translate: 'translate',
    check: 'check',
    logout: 'logout',
    notifications: 'bell-outline',
    help: 'help-circle-outline',
    settings: 'cog-outline',
    edit: 'pencil',
    download: 'download',
    delete: 'delete',
} as const;

export type IconKey = keyof typeof IconName;
export type IconValue = (typeof IconName)[IconKey];

export type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
