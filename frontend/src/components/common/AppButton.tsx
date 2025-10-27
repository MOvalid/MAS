import { ButtonProps, Button } from 'react-native-paper';
import { Spacing, metrics } from '../../theme/metrics';
import { useAppTheme } from '../../theme/AppThemeContext';

type AppButtonProps = ButtonProps & {
  marginTop?: Spacing;
  padding?: Spacing;
};

export const AppButton: React.FC<AppButtonProps> = ({
  marginTop = 'md',
  padding = 'md',
  style,
  ...props
}) => {
  const { colors, metrics: themeMetrics } = useAppTheme();

  return (
    <Button
      mode="contained"
      buttonColor={colors.primary}
      textColor={colors.onPrimary}
      style={[
        {
          marginTop: themeMetrics.spacing[marginTop],
          paddingVertical: themeMetrics.spacing[padding],
          paddingHorizontal: themeMetrics.spacing[padding] * 2,
          borderRadius: themeMetrics.radius.md,
        },
        style,
      ]}
      {...props}
    />
  );
};
