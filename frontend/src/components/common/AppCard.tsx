import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../../theme/AppThemeContext';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';

type Alignment = 'left' | 'center' | 'right';

interface AppCardProps {
  title: string;
  value: string | number;
  titleAlign?: Alignment;
  valueAlign?: Alignment;
  style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  value,
  titleAlign = 'left',
  valueAlign = 'left',
  style,
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card(colors),
        style,
      ]}
    >
      <AppText
        variant="titleMedium"
        style={[
          styles.title(colors, titleAlign),
        ]}
      >
        {title}
      </AppText>

      <AppText
        variant="headlineSmall"
        style={[
          styles.value(colors, valueAlign),
        ]}
      >
        {value}
      </AppText>
    </View>
  );
};

const styles = {
  card: (colors: any): ViewStyle => ({
    borderRadius: metrics.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outlineVariant ?? colors.outline,
    backgroundColor: colors.surface,
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    marginVertical: metrics.spacing.sm,
  }),
  title: (colors: any, align: 'left' | 'center' | 'right'): TextStyle => ({
    marginBottom: metrics.spacing.sm,
    textAlign: align,
    color: colors.onSurface,
  }),
  value: (colors: any, align: 'left' | 'center' | 'right'): TextStyle => ({
    marginTop: metrics.spacing.sm,
    textAlign: align,
    color: colors.primary,
  }),
};
