import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppLogo } from '../components/common/AppLogo';
import { AppTextInput } from '../components/common/AppTextInput';
import { AppButton } from '../components/common/AppButton';
import { AppText } from '../components/common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export const AuthScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppLogo width={200} height={200} />

      <AppTextInput label="Email address" keyboardType="email-address" />
      <AppTextInput label="Password" secureTextEntry />

      <AppButton onPress={() => console.log('Sign in pressed')}>Sign in</AppButton>

      <AppText style={styles.signupText}>
        Don’t have an account?{' '}
        <TouchableOpacity onPress={() => console.log("Sign up")}>
          <AppText weight={"bold"} italic style={{ color: theme.colors.onBackground }}>Sign up</AppText>
        </TouchableOpacity>
      </AppText>
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

export default AuthScreen;
