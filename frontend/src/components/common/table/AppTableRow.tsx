import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../common/AppText';
import { metrics } from '../../../theme/metrics';
import { AppTableActions } from './AppTableActions';

interface TableColumn {
  key: string;
  title: string;
  width?: string | number;
}

interface AppTableRowProps {
  item: Record<string, any>;
  columns: TableColumn[];
}

export const AppTableRow: React.FC<AppTableRowProps> = ({ item, columns }) => {
  return (
    <View style={styles.row}>
      {columns.map((col) => (
        <AppText key={col.key} style={[styles.cell, { width: col.width || 'auto' }]}>
          {item[col.key]}
        </AppText>
      ))}
      <AppTableActions onEdit={() => {}} onDownload={() => {}} onDelete={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.sm,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
  },
});
