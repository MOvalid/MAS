import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics, Spacing } from '../../theme/metrics';
import { ViewStyle } from 'react-native';

type Size = 'sm' | 'md' | 'lg';

type AppButtonProps = ButtonProps & {
    margin?: Spacing;
    padding?: Spacing;
    fullWidth?: boolean;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    size?: Size;
    mode?: string;
};

export const AppButton: React.FC<AppButtonProps> = ({
    margin = 'md',
    padding = 'smd',
    fullWidth = false,
    width,
    height,
    minWidth,
    minHeight,
    size = 'md',
    mode = 'contained',
    style,
    contentStyle,
    ...props
}) => {
    const { colors } = useAppTheme();

    const sizeMap = {
        sm: { height: 36, minWidth: 100 },
        md: { height: 48, minWidth: 140 },
        lg: { height: 56, minWidth: 180 },
    };

    const baseSize = sizeMap[size];

    const computedStyle: ViewStyle = {
        width: fullWidth ? '100%' : (width ?? undefined),
        minWidth: minWidth ?? baseSize.minWidth,
        borderRadius: metrics.radius.xl,
        marginVertical: metrics.spacing[margin],
        shadowColor: colors.primary,
    };

    const computedContentStyle: ViewStyle = {
        minHeight: minHeight ?? baseSize.height,
        height: height ?? baseSize.height,
        paddingVertical: metrics.spacing[padding],
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <Button
            mode={mode}
            buttonColor={mode === 'contained' ? colors.primary : undefined}
            textColor={mode === 'contained' ? colors.onPrimary : colors.primary}
            theme={{
                roundness: metrics.radius.xl,
                colors,
            }}
            style={[computedStyle, style]}
            contentStyle={[computedContentStyle, contentStyle]}
            {...props}
        />
    );
};
