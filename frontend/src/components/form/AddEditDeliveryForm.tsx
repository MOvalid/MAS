import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText, AppButton, AppTextInput } from '@/components/common';
import { AppDatePicker } from '@/components/common/AppDatePicker';
import { RadioButton, ActivityIndicator } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { Address } from '@/types/domain';
import { useCarrierOptions } from '@/composables/carrier/useCarriers';
import { useAppTheme } from '@/context/AppThemeContext';

interface AddEditDeliveryFormProps {
    initialAddress?: Address;
    initialCarrierId?: string;
    initialTracking?: string;
    initialDeliveryDate?: string;
    onSave: (
        address: Address,
        carrierId: string,
        trackingNumber: string,
        deliveryDate: string
    ) => void;
    onClose: () => void;
}

export const AddEditDeliveryForm: React.FC<AddEditDeliveryFormProps> = ({
    initialAddress,
    initialCarrierId = '',
    initialTracking = '',
    initialDeliveryDate = '',
    onSave,
    onClose,
}) => {
    const { colors } = useAppTheme();

    const [street, setStreet] = useState(initialAddress?.street ?? '');
    const [number, setNumber] = useState(initialAddress?.houseNumber ?? '');
    const [city, setCity] = useState(initialAddress?.city ?? '');
    const [postalCode, setPostalCode] = useState(initialAddress?.postalCode ?? '');
    const [country, setCountry] = useState(initialAddress?.country ?? '');
    const [trackingNumber, setTrackingNumber] = useState(initialTracking);
    const [deliveryDate, setDeliveryDate] = useState(initialDeliveryDate);
    const [carrierId, setCarrierId] = useState(initialCarrierId);

    const { data: carriersData, loading: carriersLoading } = useCarrierOptions(true, { name: '' });

    const handleSave = () => {
        const addr: Address = { street, houseNumber: number, city, postalCode, country };
        onSave(addr, carrierId, trackingNumber, deliveryDate);
    };

    return (
        <View style={styles.wrapper}>
            {/* NAGŁÓWEK */}
            <View style={styles.header}>
                <AppText variant="titleLarge" style={styles.title}>
                    Zarządzanie dostawą
                </AppText>
            </View>

            {/* SCROLLOWANA TREŚĆ */}
            <ScrollView
                showsVerticalScrollIndicator={true}
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={true}
            >
                {/* SEKCJA 1: ADRES */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <AppText
                        variant="titleLarge"
                        style={[styles.sectionTitle, { color: colors.primary }]}
                    >
                        Adres dostawy
                    </AppText>

                    {/* Wiersz 1: Ulica (pełna szerokość) */}
                    <View style={styles.row}>
                        <AppTextInput
                            fullWidth
                            label="Ulica"
                            value={street}
                            onChangeText={setStreet}
                        />
                    </View>

                    {/* Wiersz 2: Numer i Kod pocztowy */}
                    <View style={styles.row}>
                        <AppTextInput
                            style={{ flex: 1 }}
                            label="Numer domu"
                            value={number}
                            onChangeText={setNumber}
                        />
                        <AppTextInput
                            style={{ flex: 1 }}
                            label="Kod pocztowy"
                            value={postalCode}
                            onChangeText={setPostalCode}
                        />
                    </View>

                    {/* Wiersz 3: Miasto i Kraj */}
                    <View style={styles.row}>
                        <AppTextInput
                            label="Miasto"
                            value={city}
                            onChangeText={setCity}
                            // fullWidth
                        />

                        <AppTextInput label="Kraj" value={country} onChangeText={setCountry} />
                    </View>
                </View>

                {/* SEKCJA 2: SZCZEGÓŁY PRZESYŁKI */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <AppText
                        variant="titleLarge"
                        style={[styles.sectionTitle, { color: colors.primary }]}
                    >
                        Szczegóły przesyłki
                    </AppText>

                    <View style={styles.row}>
                        <AppTextInput
                            mode="outlined"
                            label="Numer przesyłki"
                            value={trackingNumber}
                            onChangeText={setTrackingNumber}
                        />
                        <View style={styles.datePickerWrapper}>
                            <AppDatePicker
                                value={deliveryDate}
                                onChange={setDeliveryDate}
                                placeholder="Data dostawy"
                            />
                        </View>
                    </View>
                </View>

                {/* SEKCJA 3: PRZEWOŹNIK */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <AppText
                        variant="titleLarge"
                        style={[styles.sectionTitle, { color: colors.primary }]}
                    >
                        Wybór przewoźnika
                    </AppText>

                    {carriersLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                    ) : (
                        <RadioButton.Group onValueChange={setCarrierId} value={carrierId}>
                            <View style={styles.radioGrid}>
                                {carriersData.map((c) => (
                                    <View key={c.id} style={styles.radioItem}>
                                        <RadioButton.Android value={c.id} color={colors.primary} />
                                        <AppText variant="bodyMedium" style={styles.radioLabel}>
                                            {c.name}
                                        </AppText>
                                    </View>
                                ))}
                            </View>
                        </RadioButton.Group>
                    )}
                </View>
            </ScrollView>

            {/* STOPKA */}
            <View style={[styles.footer, { borderTopColor: colors.outlineVariant }]}>
                <View style={styles.buttonContainer}>
                    <AppButton mode="outlined" onPress={onClose} style={styles.button}>
                        Anuluj
                    </AppButton>
                    <AppButton mode="contained" onPress={handleSave} style={styles.button}>
                        Zapisz
                    </AppButton>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        maxHeight: 600,
        maxWidth: 700,
    },
    header: {
        paddingBottom: metrics.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
        marginBottom: metrics.spacing.md,
    },
    title: {
        fontWeight: '600',
        textAlign: 'left',
    },
    scrollArea: {
        // Usunięto flex: 1
        maxHeight: 500, // Ograniczenie wysokości scroll area
    },
    scrollContent: {
        paddingBottom: metrics.spacing.md,
        gap: metrics.spacing.lg,
    },
    section: {
        // gap: metrics.spacing.sm,
        flexDirection: 'column',
        paddingHorizontal: metrics.spacing.sm,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        marginBottom: metrics.spacing.xs,
    },
    fullRow: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
        width: '100%',
    },
    halfWidth: {
        flex: 1,
    },
    datePickerWrapper: {
        flex: 1,
        alignSelf: 'center',
    },
    innerLabel: {
        marginLeft: 4,
        marginBottom: 4,
        opacity: 0.6,
        fontSize: 12,
    },
    loaderContainer: {
        paddingVertical: metrics.spacing.lg,
        alignItems: 'center',
    },
    radioGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: metrics.spacing.sm,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        paddingVertical: metrics.spacing.xs,
    },
    radioLabel: {
        marginLeft: metrics.spacing.xs,
    },
    footer: {
        // paddingTop: metrics.spacing.lg,
        borderTopWidth: 1,
        // marginTop: metrics.spacing.md,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: metrics.spacing.md,
    },
    button: {
        minWidth: 100,
    },
});
