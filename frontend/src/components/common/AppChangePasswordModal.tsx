import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, useTheme, HelperText } from 'react-native-paper';
import { AppText, AppButton, AppModal } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { useAuth } from '@/context/AuthContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const AppChangePasswordModal = ({ visible, onClose }: Props) => {
    const { updatePassword } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }

        if (newPassword.length < 8) {
            setError('Hasło musi mieć co najmniej 8 znaków');
            return;
        }

        setLoading(true);
        try {
            await updatePassword?.(oldPassword, newPassword);
            onClose();
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Nie udało się zmienić hasła. Sprawdź obecne hasło.');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            gap: metrics.spacing.md,
        },
        input: {
            backgroundColor: 'transparent',
        },
        title: {
            marginBottom: metrics.spacing.md,
            textAlign: 'center',
        },
        actions: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
            marginTop: metrics.spacing.lg,
        },
        button: {
            flex: 1,
        },
    });

    return (
        <AppModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                <AppText variant="titleLarge" style={styles.title}>
                    Zmień hasło
                </AppText>

                <TextInput
                    label="Obecne hasło"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Nowe hasło"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Powtórz nowe hasło"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    disabled={loading}
                />

                {error && (
                    <HelperText type="error" visible={!!error}>
                        {error}
                    </HelperText>
                )}

                <View style={styles.actions}>
                    <AppButton
                        mode="outlined"
                        onPress={onClose}
                        style={styles.button}
                        disabled={loading}
                    >
                        Anuluj
                    </AppButton>
                    <AppButton
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        loading={loading}
                    >
                        Zapisz
                    </AppButton>
                </View>
            </View>
        </AppModal>
    );
};
