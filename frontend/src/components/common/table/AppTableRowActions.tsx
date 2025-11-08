import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import AppIconButton from '../AppIconButton';
import { metrics } from '../../../theme/metrics';
import { IconValue } from '../icons';

export interface Action {
  icon: IconValue;
  onPress: () => void;
  iconColor?: string;
}

interface AppTableRowActionsProps {
  actions: Action[];
  style?: ViewStyle;
}

export const AppTableRowActions: React.FC<AppTableRowActionsProps> = ({
  actions,
  style,
}) => {
  return (
    <View style={[styles.actionsContainer, style]}>
      {actions.map((action, index) => (
        <AppIconButton key={index} {...action} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    paddingHorizontal: metrics.table.cellPaddingX,
    flex: 1,
  },
});

export default AppTableRowActions;
