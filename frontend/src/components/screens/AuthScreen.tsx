import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AppLogo } from '../common/AppLogo';
import { AppTextInput } from '../common/AppTextInput';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';

const screenWidth = Dimensions.get('window').width;

export const AuthScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { signIn } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSignIn = async () => {
        let hasError = false;
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Proszę podać adres email');
            hasError = true;
        }

        if (!password) {
            setPasswordError('Proszę podać hasło');
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        try {
            if (signIn) {
                await signIn({ email, password });
                navigation.replace('MainDrawer');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            const message = err?.message || 'Nieoczekiwany błąd podczas logowania';
            showSnackbar(message, 'error');
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
                    label="Adres email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    errorMessage={emailError}
                />
                <AppTextInput
                    fullWidth
                    label="Hasło"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    errorMessage={passwordError}
                />
                <AppButton fullWidth onPress={handleSignIn} loading={loading}>
                    Zaloguj się
                </AppButton>
            </View>

            <AppText style={styles.signupText}>
                Nie masz konta?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <AppText weight="bold" italic style={{ color: theme.colors.onBackground }}>
                        Zarejestruj się
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
