import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';

type AppTextInputProps = TextInputProps & {
  marginTop?: Spacing;
  padding?: Spacing;
  mode?: 'flat' | 'outlined';
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
  style,
  marginTop = 'md',
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
        colors
      }}
      style={[
        {
          minWidth: "25%",
          height: 40,
          alignSelf: 'center',
          marginTop: metrics.spacing[marginTop],
          paddingVertical: metrics.spacing[padding],
          paddingHorizontal: metrics.spacing[padding],
          borderRadius: metrics.radius.xl,
          backgroundColor: colors.secondaryContainer,
        },
        style,
      ]}
      contentStyle={{
        height: 40,
        paddingVertical: 4,
      }}
      {...props}
    />
  );
};
