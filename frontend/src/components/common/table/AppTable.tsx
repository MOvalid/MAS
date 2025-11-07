// src/components/common/table/AppTable.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../AppText';
import { useAppTheme } from '../../../theme/AppThemeContext';
import { metrics } from '../../../theme/metrics';

interface TableColumn {
  key: string;
  title: string;
}

interface AppTableProps<T> {
  title?: string;
  columns: TableColumn[];
  data: T[];
}

export const AppTable = <T extends Record<string, any>>({
  title,
  columns,
  data,
}: AppTableProps<T>) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>

      {title ? (
        <AppText
          variant="headlineSmall"
          style={[styles.tableTitle, { color: colors.onSurface }]}
        >
          {title}
        </AppText>
      ) : null}


      <View
        style={[
          styles.rowContainer,
          {
            backgroundColor: colors.secondaryContainer,
            borderColor: colors.outlineVariant ?? colors.outline,
          },
        ]}
      >
        {columns.map((col) => (
          <View key={col.key} style={styles.cell}>
            <AppText
              variant="labelLarge"
              style={[styles.headerText, { color: colors.onSecondaryContainer }]}
            >
              {col.title}
            </AppText>
          </View>
        ))}
      </View>

      <ScrollView>
        {data.map((row, index) => (
          <View
            key={index}
            style={[
              styles.rowContainer,
              {
                backgroundColor: colors.secondaryContainer,
                borderColor: colors.outlineVariant ?? colors.outline,
              },
            ]}
          >
            {columns.map((col) => (
              <View key={col.key} style={styles.cell}>
                <AppText
                  variant="bodyMedium"
                  style={[styles.cellText, { color: colors.onSurface }]}
                >
                  {row[col.key] ?? '-'}
                </AppText>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: metrics.spacing.sm,
  },
  tableTitle: {
    marginBottom: metrics.spacing.smd,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.md,
    marginBottom: metrics.spacing.sm,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  cellText: {
    textAlign: 'left',
  },
});
