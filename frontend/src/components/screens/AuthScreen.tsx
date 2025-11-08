import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppLogo } from '../common/AppLogo';
import { AppTextInput } from '../common/AppTextInput';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { metrics } from '@/theme/metrics';

const screenWidth = Dimensions.get('window').width;

export const AuthScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppLogo width={200} height={200} />

      <View style={styles.formContainer}>
        <AppTextInput fullWidth label="Email address" keyboardType="email-address" />
        <AppTextInput fullWidth label="Password" secureTextEntry />
        <AppButton fullWidth onPress={() => console.log('Sign in pressed')}>
          Sign in
        </AppButton>
      </View>

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
    paddingHorizontal: metrics.spacing.lg,
  },
  signupText: {
    marginTop: metrics.spacing.md,
  },
  formContainer: {
    width: Math.min(screenWidth * 0.8, 400),
    marginTop: metrics.spacing.lg,
  },
});

export default AuthScreen;
