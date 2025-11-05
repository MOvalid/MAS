import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppLogo } from '../common/AppLogo';
import { AppTextInput } from '../common/AppTextInput';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function ProductScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppText>ProductScreen</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    transform: [{ translateY: -screenHeight * 0.1 }], // np. 10% wysokości ekranu w górę
  },
  signupText: {
    marginTop: 16,
  },
});
