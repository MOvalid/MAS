import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../common/AppText';
import { metrics } from '../../../theme/metrics';

interface AppTableHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const AppTableHeader: React.FC<AppTableHeaderProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.headerContainer}>
      <AppText variant="headlineSmall">{title}</AppText>
      <View style={styles.actions}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: metrics.spacing.sm,
  },
});
