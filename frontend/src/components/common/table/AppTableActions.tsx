import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppIconButton from '../../common/AppIconButton';
import { metrics } from '../../../theme/metrics';

interface AppTableActionsProps {
  onEdit: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const AppTableActions: React.FC<AppTableActionsProps> = ({
  onEdit,
  onDownload,
  onDelete,
}) => {
  return (
    <View style={styles.actionContainer}>
      <AppIconButton icon="pencil" onPress={onEdit} size={20} />
      <AppIconButton icon="download" onPress={onDownload} size={20} />
      <AppIconButton icon="trash-can-outline" onPress={onDelete} size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: metrics.spacing.sm,
    flexShrink: 0,
  },
});
