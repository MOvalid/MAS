import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing } from '../../theme/metrics';

type AppTextInputProps = TextInputProps & {
  marginTop?: Spacing;
  padding?: Spacing;
};

export const AppTextInput: React.FC<AppTextInputProps> = ({
  style,
  marginTop = 'md',
  padding = 'md',
  ...props
}) => {
  const { colors, metrics } = useAppTheme();

  return (
    <TextInput
      underlineColor="transparent"
      activeUnderlineColor={colors.primary}
      theme={{ colors }}
      style={[
        {
          marginTop: metrics.spacing[marginTop],
          paddingVertical: metrics.spacing[padding],
          paddingHorizontal: metrics.spacing[padding],
          borderRadius: metrics.radius.md,
          backgroundColor: colors.surface,
        },
        style,
      ]}
      {...props}
    />
  );
};
