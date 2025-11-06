import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';
import { ViewStyle, TextStyle } from 'react-native';

type AppTextInputProps = TextInputProps & {
  margin?: Spacing;
  padding?: Spacing;
  mode?: 'flat' | 'outlined';
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
  style,
  margin = 'smd',
  padding = 'smd',
  mode = 'outlined',
  ...props
}) => {
  const { colors, metrics } = useAppTheme();

  return (
    <TextInput
      mode={mode}
      underlineColor="transparent"
      activeUnderlineColor={colors.primary}
      outlineColor={colors.background}
      textColor={colors.background}
      placeholderTextColor={colors.primary}
      theme={{
        roundness: metrics.radius.xl,
        colors,
      }}
      style={[
        appTextInputStyles.container(colors, metrics, margin, padding),
        style,
      ]}
      contentStyle={appTextInputStyles.content}
      {...props}
    />
  );
};

// 🎨 Wszystkie style wydzielone do osobnej zmiennej
const appTextInputStyles = {
  container: (
    colors: any,
    metrics: any,
    margin: Spacing,
    padding: Spacing
  ): ViewStyle => ({
    width: '100%',
    height: 40,
    alignSelf: 'center',
    marginTop: metrics.spacing[margin],
    marginBottom: metrics.spacing[margin],
    paddingVertical: metrics.spacing[padding],
    paddingHorizontal: metrics.spacing[padding],
    borderRadius: metrics.radius.xl,
    backgroundColor: colors.secondaryContainer,
  }),

  content: {
    height: 40,
  } as TextStyle,
};
