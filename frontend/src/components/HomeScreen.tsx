import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './common/AppText';
import { AppCard } from './common/AppCard';
import { AppTextInput } from './common/AppTextInput';
import { AppButton } from './common/AppButton';
import { AuthScreen } from './AuthScreen';

export default function HomeScreen() {
  return (
    // 
    <AuthScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
