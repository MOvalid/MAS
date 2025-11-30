import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import { metrics } from '../../theme/metrics';
import { AppBreadcrumb } from './AppBreadcrumbConfig';

type ScreenWrapperProps = {
    children: React.ReactNode;
};

export const AppScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            edges={['top', 'right', 'bottom']}
        >
            <View style={styles.mainArea}>
                <AppHeader />
                <AppBreadcrumb />
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                >
                    {children}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainArea: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        padding: metrics.spacing.lg,
    },
});
