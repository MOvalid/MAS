// src/components/AppText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { TextSize } from '../../theme/metrics';

type AppTextProps = TextProps & {
  size?: TextSize;
  weight?: 'normal' | 'bold';
  color?: string;
  italic?: boolean;
};

export const AppText: React.FC<AppTextProps> = ({
  size = 'normal',
  weight = 'normal',
  color,
  italic = false,
  style,
  children,
  ...props
}) => {
  const { metrics, colors } = useAppTheme();

  return (
    <Text
      style={[
        {
          fontSize: metrics.text[size],
          fontWeight: weight,
          color: color ?? colors.onSurface,
          fontStyle: italic ? 'italic' : 'normal',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
