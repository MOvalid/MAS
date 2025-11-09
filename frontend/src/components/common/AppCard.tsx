// AppCard.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics } from '../../theme/metrics';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface AppCardProps {
    children?: ReactNode;
    style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style }) => {
    const { colors } = useAppTheme();

    return <View style={[styles.card(colors), style]}>{children}</View>;
};

const styles = {
    card: (colors: MD3Colors): ViewStyle => ({
        borderRadius: metrics.radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.outlineVariant ?? colors.outline,
        backgroundColor: colors.surface,
        paddingVertical: metrics.spacing.md,
        paddingHorizontal: metrics.spacing.lg,
        marginVertical: metrics.spacing.sm,
    }),
};
