import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { AppLogo } from '../common/AppLogo';
import { AppTextInput } from '../common/AppTextInput';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useAuth } from '@/context/AuthContext';
import { loginAPI } from '@/api/authApi';
import axios, { AxiosError } from 'axios';
import { RootStackParamList } from '@/types/dto/auth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const screenWidth = Dimensions.get('window').width;

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const theme = useTheme();
    const { setAccessToken } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const data = await loginAPI({ email, password });
            await setAccessToken(data.accessToken);
            navigation.replace('Main');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                Alert.alert('Login failed', axiosError.response?.data?.message || error.message);
            } else {
                Alert.alert('Login failed', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AppLogo width={200} height={200} />
            <View style={styles.formContainer}>
                <AppTextInput
                    fullWidth
                    label="Email address"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <AppTextInput
                    fullWidth
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <AppButton fullWidth onPress={handleSignIn} loading={loading}>
                    Sign in
                </AppButton>
            </View>

            <AppText style={styles.signupText}>
                Don’t have an account?{' '}
                <TouchableOpacity onPress={() => console.log('Sign up')}>
                    <AppText weight="bold" italic style={{ color: theme.colors.onBackground }}>
                        Sign up
                    </AppText>
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
    signupText: { marginTop: metrics.spacing.md },
    formContainer: {
        width: Math.min(screenWidth * 0.8, 400),
        marginTop: metrics.spacing.lg,
    },
});

export default AuthScreen;
