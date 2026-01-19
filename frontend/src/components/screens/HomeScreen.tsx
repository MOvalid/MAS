// HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { metrics } from '../../theme/metrics';
import { AppCard } from '../common/AppCard';
import { useDailySummary } from '@/composables/useDailySummary';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
    const navigation = useNavigation();
    const { data, loading, error, refresh } = useDailySummary();

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        const friendly = getFriendlyErrorMessage(error);

        return (
            <ErrorScreen
                title="Nie udało się pobrać danych"
                message={friendly.message}
                onRetry={refresh}
            />
        );
    }

    return (
        <View style={styles.container}>
            <AppText variant="displayMedium" style={styles.title}>
                Dzień dobry!
            </AppText>

            <View style={styles.buttonRow}>
                <AppButton
                    style={styles.button}
                    onPress={() => navigation.navigate('Order', { screen: 'OrderAdd' })}
                >
                    Nowe zamówienie
                </AppButton>
                <AppButton
                    style={styles.button}
                    onPress={() => navigation.navigate('Invoice', { screen: 'Invoice' })}
                >
                    Sprawdź faktury
                </AppButton>
                <AppButton
                    style={styles.button}
                    onPress={() => navigation.navigate('Customer', { screen: 'CustomerAdd' })}
                >
                    Nowy klient
                </AppButton>
                <AppButton
                    style={styles.button}
                    onPress={() => navigation.navigate('Product', { screen: 'ProductAdd' })}
                >
                    Dodaj produkt
                </AppButton>
                <AppButton
                    style={styles.button}
                    onPress={() => navigation.navigate('Stock', { screen: 'Stock' })}
                >
                    Sprawdź stan
                </AppButton>
            </View>

            <AppText variant="headlineMedium" style={styles.sectionTitle}>
                Podsumowanie dnia
            </AppText>

            <View style={styles.cardContainer}>
                {data.map((item) => (
                    <AppCard key={item.id} style={styles.card}>
                        <AppText variant="titleMedium" numberOfLines={2} ellipsizeMode="tail">
                            {item.title}
                        </AppText>
                        <AppText variant="headlineSmall">{item.value}</AppText>
                    </AppCard>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: metrics.spacing.lg,
    },
    title: {
        textAlign: 'center',
    },
    sectionTitle: {
        marginTop: metrics.spacing.md,
        marginBottom: metrics.spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: metrics.spacing.sm,
    },
    button: {
        flex: 1,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: metrics.spacing.lg,
    },
    card: {
        flexBasis: '32%',
        flexGrow: 0,
        flexShrink: 0,
        minHeight: 120,
    },
});
