import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppLogo } from '../components/common/AppLogo';
import { AppTextInput } from '../components/common/AppTextInput';
import { AppButton } from '../components/common/AppButton';
import { AppText } from '../components/common/AppText';
import { useNavigation } from '@react-navigation/native';

export const AuthScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppLogo size={100} />

      <AppTextInput label="Email address" keyboardType="email-address" />
      <AppTextInput label="Password" secureTextEntry />

      <AppButton onPress={() => console.log('Sign in pressed')}>Sign in</AppButton>

      <AppText style={styles.signupText}>
        Don’t have an account?{' '}
        <TouchableOpacity onPress={() => console.log("Sign up")}>
          <AppText style={{ fontWeight: '700', color: '#142144' }}>Sign up</AppText>
        </TouchableOpacity>
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  signupText: {
    marginTop: 16,
  },
});

export default AuthScreen;
