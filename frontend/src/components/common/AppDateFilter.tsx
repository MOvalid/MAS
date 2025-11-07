import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput } from './AppTextInput';
import { AppText } from './AppText';
import { metrics } from '../../theme/metrics';

interface AppDateFilterProps {
  label?: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const AppDateFilter: React.FC<AppDateFilterProps> = ({
  label = 'Filtruj po dacie',
  onChange,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <View style={styles.container}>
      <AppText variant="labelLarge" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.inputsRow}>
        <AppTextInput
          label="Od"
          value={startDate}
          onChangeText={(v) => {
            setStartDate(v);
            onChange(v, endDate);
          }}
          style={styles.input}
        />
        <AppTextInput
          label="Do"
          value={endDate}
          onChangeText={(v) => {
            setEndDate(v);
            onChange(startDate, v);
          }}
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: metrics.spacing.md,
  },
  label: {
    marginBottom: metrics.spacing.sm,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: metrics.spacing.smd,
  },
  input: {
    flex: 1,
  },
});
