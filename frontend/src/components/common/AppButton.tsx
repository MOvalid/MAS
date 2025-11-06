import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { metrics, Spacing } from '../../theme/metrics';

type AppButtonProps = ButtonProps & {
  margin?: Spacing;
  padding?: Spacing;
};

export const AppButton: React.FC<AppButtonProps> = ({
  margin = 'md',
  padding = 'smd',
  style,
  ...props
}) => {
  const { colors } = useAppTheme();

  const styles = {
    base: {
      width: '100%' as const,
      height: metrics.element?.height,
      justifyContent: 'center' as const,
      borderRadius: metrics.radius.xl,
      marginVertical: metrics.spacing[margin],
      paddingVertical: metrics.spacing[padding],
      shadowColor: colors.primary,
    },
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
      style={[styles.base, style]}
      {...props}
    />
  );
};
