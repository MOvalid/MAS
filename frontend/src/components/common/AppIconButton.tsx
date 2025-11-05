import React from 'react';
import { StyleSheet } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AppIconButtonProps = {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
};

export const AppIconButton: React.FC<AppIconButtonProps> = ({
  label,
  icon,
  active = false,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Drawer.Item
      label={label}
      icon={({ color, size }) => (
        <MaterialCommunityIcons name={icon as any} color={color} size={size} />
      )}
      active={active}
      onPress={onPress}
      style={[styles.item]}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 2,
    borderRadius: 8,
  },
});
