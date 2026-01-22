// SnackbarContext.tsx

import { metrics } from '@/theme/metrics';
import { YELLOW, BLACK, WHITE } from '@/theme/theme';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { MD3Theme, Snackbar, useTheme } from 'react-native-paper';

type SnackbarType = 'success' | 'warning' | 'info' | 'error';

interface SnackbarContextType {
    showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [type, setType] = useState<SnackbarType>('success');

    const theme = useTheme();
    const styles = createStyles(theme);

    const showSnackbar = (msg: string, snackbarType: SnackbarType = 'success') => {
        setMessage(msg);
        setType(snackbarType);
        setVisible(true);
    };

    const hideSnackbar = () => {
        setVisible(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={3000}
                style={[styles.snackbar, styles[type]]}
            >
                <Text style={[styles.snackbarText, styles[`${type}Text`]]}>{message}</Text>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
const createStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        snackbar: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
            top: metrics.spacing.xl,
            alignSelf: 'center',
            width: Platform.OS === 'web' ? '40%' : '90%',
            maxWidth: 600,
            borderRadius: metrics.radius.xl,
            zIndex: 9999,
        },
        snackbarText: {
            ...theme.fonts.bodyMedium,
            textAlign: 'center',
        },
        success: { backgroundColor: theme.colors.inverseSurface },
        warning: { backgroundColor: YELLOW },
        info: { backgroundColor: '#9E9E9E' },
        error: { backgroundColor: theme.colors.errorContainer },
        successText: { color: theme.colors.inverseOnSurface },
        warningText: { color: BLACK },
        errorText: { color: theme.colors.onErrorContainer },
        infoText: { color: WHITE },
    });
