import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText, AppButton, AppTextInput } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { Address } from '@/types/domain';

interface AddEditDeliveryFormProps {
    initialAddress?: Address;
    initialCarrier?: string;
    initialTracking?: string;
    onSave: (address: Address, carrier: string, trackingNumber: string) => void;
    onClose: () => void;
}

export const AddEditDeliveryForm: React.FC<AddEditDeliveryFormProps> = ({
    initialAddress,
    initialCarrier = '',
    initialTracking = '',
    onSave,
    onClose,
}) => {
    const [street, setStreet] = useState(initialAddress?.street ?? '');
    const [number, setNumber] = useState(initialAddress?.number ?? '');
    const [city, setCity] = useState(initialAddress?.city ?? '');
    const [postalCode, setPostalCode] = useState(initialAddress?.postalCode ?? '');
    const [country, setCountry] = useState(initialAddress?.country ?? '');
    const [carrier, setCarrier] = useState(initialCarrier);
    const [trackingNumber, setTrackingNumber] = useState(initialTracking);

    const handleSave = () => {
        const addr: Address = { street, number, city, postalCode, country };
        onSave(addr, carrier, trackingNumber);
        onClose();
    };

    return (
        <View style={styles.container}>
            <AppText variant="titleLarge" style={styles.title}>
                Dodaj / Edytuj dostawę
            </AppText>

            <ScrollView
                horizontal={false}
                contentContainerStyle={{ gap: metrics.spacing.md }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.row}>
                    <View style={styles.column}>
                        <AppTextInput label="Ulica" value={street} onChangeText={setStreet} />
                        <AppTextInput label="Numer" value={number} onChangeText={setNumber} />
                        <AppTextInput
                            label="Numer przesyłki"
                            value={trackingNumber}
                            onChangeText={setTrackingNumber}
                        />
                    </View>

                    {/* Kolumna 2 */}
                    <View style={styles.column}>
                        <AppTextInput
                            label="Miasto"
                            fullWidth
                            value={city}
                            onChangeText={setCity}
                        />
                        <AppTextInput
                            label="Kod pocztowy"
                            value={postalCode}
                            fullWidth
                            onChangeText={setPostalCode}
                        />
                    </View>

                    {/* Kolumna 3 */}
                    <View style={styles.column}>
                        <AppTextInput
                            label="Kraj"
                            fullWidth
                            value={country}
                            onChangeText={setCountry}
                        />
                        <AppTextInput
                            label="Przewoźnik"
                            fullWidth
                            value={carrier}
                            onChangeText={setCarrier}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonsContainer}>
                <AppButton mode="outlined" onPress={onClose}>
                    Anuluj
                </AppButton>
                <AppButton mode="contained" onPress={handleSave}>
                    Zapisz
                </AppButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: metrics.spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: metrics.spacing.md,
    },
    column: {
        flex: 1,
        gap: metrics.spacing.md,
        minWidth: 0,
        flexShrink: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: metrics.spacing.md,
        // marginTop: metrics.spacing.lg,
    },
});
