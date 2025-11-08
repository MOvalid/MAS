import { metrics } from '@/theme/metrics';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

type AppLogoProps = {
  width?: number;
  height?: number;
};

export const AppLogo: React.FC<AppLogoProps> = ({ width = 120, height = 120 }) => (
  <Image
    source={require('../../../assets/mas-icon-transparent.png')}
    style={[styles.logo, { width: width, height: height }]}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  logo: {
    marginBottom: metrics.spacing.xl,
    borderRadius: metrics.radius.md,
  },
});
