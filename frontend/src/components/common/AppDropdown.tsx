import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, useTheme } from 'react-native-paper';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';

export interface DropdownOption {
  label: string;
  value: string;
}

interface AppDropdownProps {
  label: string;
  options: DropdownOption[];
  selected?: string;
  onSelect: (value: string) => void;
  fullWidth?: boolean;
}

export const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  options,
  selected,
  onSelect,
  fullWidth = false,
}) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label || label;

  return (
    <View style={[styles.container, fullWidth && { width: '100%' }]}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            textColor={theme.colors.onSurface}
            style={[
              styles.button,
              { borderColor: theme.colors.outline },
              fullWidth && { width: '100%' },
            ]}
          >
            {selectedLabel}
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onSelect(option.value);
              setVisible(false);
            }}
            title={option.label}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: metrics.spacing.smd,
  },
  button: {
    borderRadius: metrics.radius.lg,
  },
});
