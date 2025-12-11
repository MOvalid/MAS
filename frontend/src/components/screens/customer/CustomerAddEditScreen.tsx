import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, LayoutChangeEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';
import { metrics } from '@/theme/metrics';

const CustomerImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764539847/charlesdeluvio-rRWiVQzLm7k-unsplash_lpwbuq.jpg';

const EMPTY_CUSTOMER = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { street: '', number: '', city: '', postalCode: '', country: '' },
};

const mockCustomer = {
    id: '987',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 500 600 700',
    address: {
        street: 'Lipowa',
        number: '22A',
        city: 'Kraków',
        postalCode: '30-001',
        country: 'Polska',
    },
};

export const CustomerAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);

    const initial = isEdit ? mockCustomer : EMPTY_CUSTOMER;

    const [firstName, setFirstName] = useState(initial.firstName);
    const [lastName, setLastName] = useState(initial.lastName);
    const [email, setEmail] = useState(initial.email || '');
    const [phone, setPhone] = useState(initial.phone || '');

    const [street, setStreet] = useState(initial.address.street);
    const [number, setNumber] = useState(initial.address.number);
    const [city, setCity] = useState(initial.address.city);
    const [postalCode, setPostalCode] = useState(initial.address.postalCode);
    const [country, setCountry] = useState(initial.address.country);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cardHeight, setCardHeight] = useState<number>(0);

    const pageTitle = isEdit
        ? `Edycja klienta ${firstName || ''} ${lastName || ''}`
        : 'Dodaj nowego klienta';

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!firstName) newErrors.firstName = 'Imię jest wymagane';
        if (!lastName) newErrors.lastName = 'Nazwisko jest wymagane';

        if (!street) newErrors.street = 'Ulica jest wymagana';
        if (!number) newErrors.number = 'Numer jest wymagany';
        if (!city) newErrors.city = 'Miasto jest wymagane';
        if (!postalCode) newErrors.postalCode = 'Kod pocztowy jest wymagany';
        if (!country) newErrors.country = 'Kraj jest wymagany';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const payload = {
            id: initial.id,
            firstName,
            lastName,
            email: email || null,
            phone: phone || null,
            address: { street, number, city, postalCode, country },
        };

        console.log(isEdit ? '➡️ Aktualizacja klienta:' : '🆕 Tworzenie klienta:', payload);
        navigation.goBack();
    };

    const handleCancel = () => navigation.goBack();

    const styles = StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg },
        actionRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: metrics.spacing.md,
            marginVertical: metrics.spacing.sm,
        },
        contentRow: {
            flexDirection: 'row',
            gap: metrics.spacing.xl,
            alignItems: 'flex-start',
            marginBottom: metrics.spacing.xl,
        },
        imageContainer: { width: '45%', marginVertical: metrics.spacing.sm },
        image: { width: '100%', borderRadius: metrics.radius.lg },
        card: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingVertical: metrics.spacing.md,
        },
        inputRow: { marginBottom: metrics.spacing.md },
        inputLabel: { marginBottom: metrics.spacing.xs, color: theme.colors.onSurfaceVariant },
        button: { minWidth: 160 },
    });

    const ActionButtons = () => (
        <View style={styles.actionRow}>
            <AppButton onPress={handleCancel} style={styles.button} mode="outlined">
                Anuluj
            </AppButton>
            <AppButton onPress={handleSave} style={styles.button} mode="contained">
                {isEdit ? 'Zapisz zmiany' : 'Dodaj klienta'}
            </AppButton>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={{ marginBottom: metrics.spacing.lg }}>
                {pageTitle}
            </AppText>

            <View style={styles.contentRow}>
                <View style={[styles.imageContainer, { height: cardHeight }]}>
                    <Image
                        source={{ uri: CustomerImage }}
                        style={[styles.image, { height: cardHeight }]}
                    />
                </View>

                <AppCard
                    style={styles.card}
                    onLayout={(event: LayoutChangeEvent) =>
                        setCardHeight(event.nativeEvent.layout.height)
                    }
                >
                    {/* IMIĘ */}
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Imię *
                        </AppText>
                        <AppTextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            fullWidth
                            errorMessage={errors.firstName}
                        />
                    </View>

                    {/* NAZWISKO */}
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Nazwisko *
                        </AppText>
                        <AppTextInput
                            value={lastName}
                            onChangeText={setLastName}
                            fullWidth
                            errorMessage={errors.lastName}
                        />
                    </View>

                    {/* EMAIL */}
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            E-mail
                        </AppText>
                        <AppTextInput
                            value={email}
                            onChangeText={setEmail}
                            fullWidth
                            keyboardType="email-address"
                        />
                    </View>

                    {/* TELEFON */}
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Telefon
                        </AppText>
                        <AppTextInput
                            value={phone}
                            onChangeText={setPhone}
                            fullWidth
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* ADRES */}
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Ulica *
                        </AppText>
                        <AppTextInput
                            value={street}
                            onChangeText={setStreet}
                            fullWidth
                            errorMessage={errors.street}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Numer *
                        </AppText>
                        <AppTextInput
                            value={number}
                            onChangeText={setNumber}
                            fullWidth
                            errorMessage={errors.number}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Miasto *
                        </AppText>
                        <AppTextInput
                            value={city}
                            onChangeText={setCity}
                            fullWidth
                            errorMessage={errors.city}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Kod pocztowy *
                        </AppText>
                        <AppTextInput
                            value={postalCode}
                            onChangeText={setPostalCode}
                            fullWidth
                            errorMessage={errors.postalCode}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Kraj *
                        </AppText>
                        <AppTextInput
                            value={country}
                            onChangeText={setCountry}
                            fullWidth
                            errorMessage={errors.country}
                        />
                    </View>

                    <ActionButtons />
                </AppCard>
            </View>
        </ScrollView>
    );
};
