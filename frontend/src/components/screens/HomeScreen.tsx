// HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { metrics } from '../../theme/metrics';
import { AppCard } from '../common/AppCard';

export const HomeScreen = () => {
    const dailySummary = [
        { id: 1, title: 'Przychody dzisiaj', value: '12 345 PLN' },
        { id: 2, title: 'Zamówienia', value: '58' },
        { id: 3, title: 'Nowi klienci', value: '7' },
        { id: 4, title: 'Wysłane faktury', value: '21' },
        { id: 5, title: 'Produkty w magazynie', value: '156' },
        { id: 6, title: 'Zwroty', value: '3' },
        { id: 7, title: 'Wysłane faktury', value: '21' },
        { id: 8, title: 'Produkty w magazynie', value: '156' },
        { id: 9, title: 'Zwroty', value: '3' },
    ];

    return (
        <View style={styles.container}>
            <AppText variant="displayMedium" style={styles.title}>
                Dzień dobry, Jan!!!
            </AppText>

            <View style={styles.buttonRow}>
                <AppButton style={styles.button}>Nowe zamówienie</AppButton>
                <AppButton style={styles.button}>Wystaw fakturę</AppButton>
                <AppButton style={styles.button}>Nowy klient</AppButton>
                <AppButton style={styles.button}>Dodaj produkt</AppButton>
                <AppButton style={styles.button}>Sprawdź stan</AppButton>
            </View>

            <AppText variant="headlineMedium" style={styles.sectionTitle}>
                Podsumowanie dnia
            </AppText>

            <View style={styles.cardContainer}>
                {dailySummary.map((item) => (
                    <AppCard key={item.id} style={styles.card}>
                        <AppText variant="titleMedium">{item.title}</AppText>
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
