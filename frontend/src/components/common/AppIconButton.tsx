import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { IconButton, IconButtonProps, Text, useTheme } from 'react-native-paper';
import { metrics, Spacing } from '../../theme/metrics';

interface AppIconButtonProps extends Omit<IconButtonProps, 'icon' | 'onPress'> {
  icon: string;
  label?: string;
  onPress: () => void;
  iconColor?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  badge?: string | number;
  badgeStyle?: ViewStyle;
  badgeColor?: string;
  badgeTextColor?: string;
  spacing?: Spacing;
}

const AppIconButton: React.FC<AppIconButtonProps> = ({
  icon,
  label,
  onPress,
  size = 24,
  iconColor,
  labelStyle,
  containerStyle,
  disabled = false,
  badge,
  badgeStyle,
  badgeColor,
  badgeTextColor,
  spacing = 'sm',
  ...rest
}) => {
  const theme = useTheme();

  const finalIconColor = iconColor || (disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface);
  const finalLabelColor = disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface;
  const finalBadgeColor = badgeColor || theme.colors.error;
  const finalBadgeTextColor = badgeTextColor || theme.colors.onError;

  const gapValue = metrics.spacing[spacing as keyof typeof metrics.spacing];

  return (
    <View style={[styles.container, { gap: gapValue }, containerStyle]}>
      <View style={styles.iconWrapper}>
        <IconButton
          icon={icon}
          size={size}
          iconColor={finalIconColor}
          onPress={onPress}
          disabled={disabled}
          {...rest}
        />
        {badge && (
          <View style={[
            styles.badge, 
            { 
              backgroundColor: finalBadgeColor,
              borderRadius: metrics.radius.xl,
              minWidth: metrics.spacing.md + 2,
              height: metrics.spacing.md + 2,
            },
            badgeStyle
          ]}>
            <Text style={[
              styles.badgeText,
              { 
                color: finalBadgeTextColor,
                fontSize: metrics.text.small - 2,
              }
            ]}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            { 
              color: finalLabelColor,
              fontSize: metrics.text.small,
            },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  label: {
    marginTop: -metrics.spacing.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: metrics.spacing.xs,
    right: metrics.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.xs,
  },
  badgeText: {
    fontWeight: 'bold',
  },
});

export default AppIconButton;
