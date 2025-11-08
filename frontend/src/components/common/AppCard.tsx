import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type Alignment = 'left' | 'center' | 'right';

interface AppCardProps {
    title: string;
    value: string | number;
    titleAlign?: Alignment;
    valueAlign?: Alignment;
    style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({
    title,
    value,
    titleAlign = 'left',
    valueAlign = 'left',
    style,
}) => {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.card(colors), style]}>
            <AppText variant="titleMedium" style={[styles.title(colors, titleAlign)]}>
                {title}
            </AppText>

            <AppText variant="headlineSmall" style={[styles.value(colors, valueAlign)]}>
                {value}
            </AppText>
        </View>
    );
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
    title: (colors: MD3Colors, align: Alignment): TextStyle => ({
        marginBottom: metrics.spacing.sm,
        textAlign: align,
        color: colors.onSurface,
    }),
    value: (colors: MD3Colors, align: Alignment): TextStyle => ({
        marginTop: metrics.spacing.sm,
        textAlign: align,
        color: colors.primary,
    }),
};
