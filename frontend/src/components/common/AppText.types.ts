import { TextProps } from 'react-native';
import { TextSize, TextAlign, AppFontWeight } from '../../theme/metrics';
import { useAppTheme } from '../../theme/AppThemeContext';

export type AppTextVariant =
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

export interface AppTextProps extends TextProps {
  size?: TextSize;
  weight?: AppFontWeight;
  variant?: AppTextVariant;
  color?: keyof ReturnType<typeof useAppTheme>['colors'] | string;
  italic?: boolean;
  align?: TextAlign;
}
