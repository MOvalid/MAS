import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics, Spacing } from '../../theme/metrics';
import { ViewStyle, StyleSheet } from 'react-native';

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
  style,
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
    width: fullWidth ? '100%' : width ?? undefined,
    minWidth: minWidth ?? baseSize.minWidth,
    minHeight: minHeight ?? baseSize.height,
    height: height ?? baseSize.height,
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    borderRadius: metrics.radius.xl,
    marginVertical: metrics.spacing[margin],
    paddingVertical: metrics.spacing[padding],
    shadowColor: colors.primary,
  };

  return (
    <Button
      mode="contained"
      buttonColor={colors.primary}
      textColor={colors.onPrimary}
      theme={{
        roundness: metrics.radius.xl,
        colors,
      }}
      style={[styles.button, computedStyle, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});
