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

export const SignUpScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { signUp, confirmSignUp, resendSignUp } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'signup' | 'confirm'>('signup');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [codeError, setCodeError] = useState('');

    const handleSignUp = async () => {
        setEmailError('');
        setPasswordError('');
        if (!email) setEmailError('Proszę podać adres email');
        if (!password) setPasswordError('Proszę podać hasło');
        if (emailError || passwordError) return;

        setLoading(true);
        try {
            if (signUp) {
                await signUp({ email, password });
                setStep('confirm');
                showSnackbar('Kod weryfikacyjny został wysłany na Twój email', 'success');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            const message = err?.message || 'Nie udało się zarejestrować';
            showSnackbar(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setCodeError('');
        if (!code) {
            setCodeError('Proszę podać kod weryfikacyjny');
            return;
        }

        setLoading(true);
        try {
            if (confirmSignUp) {
                await confirmSignUp(email, code);
                showSnackbar('Konto potwierdzone! Możesz się teraz zalogować.', 'success');
                navigation.navigate('Auth');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            const message = err?.message || 'Nie udało się potwierdzić konta';
            showSnackbar(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            if (resendSignUp) {
                await resendSignUp({ email, password });
                showSnackbar('Kod weryfikacyjny został wysłany ponownie', 'success');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            const message = err?.message || 'Nie udało się wysłać kodu';
            showSnackbar(message, 'error');
        }
    };

    return (
        <View style={styles.container}>
            <AppLogo width={200} height={200} />
            <View style={styles.formContainer}>
                {step === 'signup' ? (
                    <>
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
                        <AppButton fullWidth onPress={handleSignUp} loading={loading}>
                            Zarejestruj się
                        </AppButton>
                    </>
                ) : (
                    <>
                        <AppTextInput
                            fullWidth
                            label="Kod weryfikacyjny"
                            value={code}
                            onChangeText={setCode}
                            errorMessage={codeError}
                        />
                        <AppButton fullWidth onPress={handleConfirm} loading={loading}>
                            Potwierdź
                        </AppButton>
                        <TouchableOpacity
                            onPress={handleResend}
                            style={{ marginTop: metrics.spacing.md }}
                        >
                            <AppText style={{ color: theme.colors.primary }}>
                                Wyślij ponownie kod
                            </AppText>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <AppText style={styles.loginText}>
                Masz już konto?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                    <AppText weight="bold" italic style={{ color: theme.colors.onBackground }}>
                        Zaloguj się
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
    loginText: { marginTop: metrics.spacing.md },
    formContainer: { width: Math.min(screenWidth * 0.8, 400), marginTop: metrics.spacing.lg },
});

export default SignUpScreen;
