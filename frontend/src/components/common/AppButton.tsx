import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';

type AppButtonProps = ButtonProps & {
  marginTop?: Spacing;
  padding?: Spacing;
  minWidth?: string | number;
  minHeight?: string | number;
};

export const AppButton: React.FC<AppButtonProps> = ({
  marginTop = 'md',
  padding = 'smd',
  minWidth = '30%',
  minHeight = '10%',
  style,
  ...props
}) => {
  const { colors, metrics } = useAppTheme();

  return (
    <Button
      mode="contained"
      buttonColor={colors.primary}
      textColor={colors.onPrimary}
      theme={{
        roundness: metrics.radius.xl,
        colors,
      }}
      style={[
        {
          shadowColor: colors.primary,
          minWidth: "25%",
          alignSelf: 'center',
          marginTop: metrics.spacing[marginTop],
          paddingVertical: metrics.spacing[padding],
          paddingHorizontal: metrics.spacing[padding],
          borderRadius: metrics.radius.xl,
          // backgroundColor: colors.surface,
        },
        style,
      ]}
      {...props}
    />
  );
};
