import React from 'react';
import { Image, StyleSheet } from 'react-native';

type AppLogoProps = {
  size?: number;
};

export const AppLogo: React.FC<AppLogoProps> = ({ size = 120 }) => (
  <Image
    source={require('../../../assets/mas-icon.png')}
    style={[styles.logo, { width: size, height: size }]}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  logo: {
    marginBottom: 32,
  },
});
