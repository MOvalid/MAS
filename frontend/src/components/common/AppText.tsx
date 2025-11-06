// src/components/AppText.tsx
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { TextSize } from '../../theme/metrics';

type AppTextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

interface AppTextProps extends TextProps {
  size?: TextSize;
  weight?: 'normal' | 'bold';
  variant?: AppTextVariant;
  color?: keyof ReturnType<typeof useAppTheme>['colors'] | string;
  italic?: boolean;
  align?: TextStyle['textAlign'];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'bodyMedium',
  color,
  size = 'normal',
  weight = 'normal',
  italic = false,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { fonts, colors } = useAppTheme();

  const textStyleFromTheme = fonts[variant] ?? fonts.bodyMedium;

  const resolvedColor =
    color && colors[color as keyof typeof colors]
      ? colors[color as keyof typeof colors]
      : color ?? colors.onSurface;

  return (
    <Text
      style={[
        textStyleFromTheme,
        {
          color: resolvedColor,
          fontStyle: italic ? 'italic' : 'normal',
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
