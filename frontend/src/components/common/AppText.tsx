import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { AppTextProps } from './AppText.types';

export const AppText: React.FC<AppTextProps> = ({
    variant = 'bodyMedium',
    color,
    weight = 'normal',
    italic = false,
    align = 'left',
    style,
    children,
    ...props
}) => {
    const { fonts, colors } = useAppTheme();
    const textStyleFromTheme = fonts[variant] ?? fonts.bodyMedium;

    const resolvedColor = (
        color && colors[color as keyof typeof colors]
            ? colors[color as keyof typeof colors]
            : (color ?? colors.onSurface)
    ) as string;

    const baseTextStyle = StyleSheet.create({
        text: {
            ...textStyleFromTheme,
            color: resolvedColor,
            fontStyle: italic ? 'italic' : 'normal',
            textAlign: align,
            fontWeight: weight,
        },
    });

    return (
        <Text style={[baseTextStyle.text, style]} {...props}>
            {children}
        </Text>
    );
};
