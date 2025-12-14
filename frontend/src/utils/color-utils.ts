import { MD3Theme } from 'react-native-paper';

export const getPaymentStatusColor = (status: string, theme: MD3Theme) => {
    switch (status) {
        case 'PAID':
            return theme.colors.primary;
        case 'PARTIAL':
            return theme.colors.tertiary;
        case 'OVERPAID':
            return theme.colors.error;
        default:
            return theme.colors.onSurfaceVariant;
    }
};
