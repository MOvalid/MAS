import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, LayoutChangeEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { Company } from '@/types/domain/company';
import { formatNip } from '@/utils/formatters';

const CompanyImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764533804/modern-urban-buildings-view_vhmzbe.jpg';

const EMPTY_COMPANY: Company = {
    id: '',
    name: '',
    taxId: '',
    address: { street: '', number: '', city: '', postalCode: '', country: '' },
    email: '',
    phone: '',
};

const mockCompany: Company = {
    id: '123',
    name: 'Firma Przykładowa Sp. z o.o.',
    taxId: '1234567890',
    address: {
        street: 'Przykładowa',
        number: '1',
        city: 'Warszawa',
        postalCode: '00-001',
        country: 'Polska',
    },
    email: 'kontakt@firma.pl',
    phone: '+48 123 456 789',
};

export const CompanyAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);
    const initial = isEdit ? mockCompany : EMPTY_COMPANY;

    const [name, setName] = useState(initial.name);
    const [taxId, setTaxId] = useState(initial.taxId);
    const [street, setStreet] = useState(initial.address.street);
    const [number, setNumber] = useState(initial.address.number);
    const [city, setCity] = useState(initial.address.city);
    const [postalCode, setPostalCode] = useState(initial.address.postalCode);
    const [country, setCountry] = useState(initial.address.country);
    const [email, setEmail] = useState(initial.email || '');
    const [phone, setPhone] = useState(initial.phone || '');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cardHeight, setCardHeight] = useState<number>(0);

    const pageTitle = isEdit ? `Edycja firmy ${name || ''}` : 'Dodaj nową firmę';

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!name) newErrors.name = 'Nazwa firmy jest wymagana';
        if (!taxId || !/^\d{10}$/.test(taxId)) newErrors.taxId = 'NIP musi składać się z 10 cyfr';
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
        const payload: Company = {
            id: initial.id,
            name,
            taxId,
            address: { street, number, city, postalCode, country },
            email: email || null,
            phone: phone || null,
        };
        console.log(isEdit ? '➡️ Aktualizacja firmy:' : '🆕 Tworzenie nowej firmy:', payload);
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
                {isEdit ? 'Zapisz zmiany' : 'Dodaj firmę'}
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
                        source={{ uri: CompanyImage }}
                        style={[styles.image, { height: cardHeight }]}
                    />
                </View>

                <AppCard
                    style={styles.card}
                    onLayout={(event: LayoutChangeEvent) =>
                        setCardHeight(event.nativeEvent.layout.height)
                    }
                >
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Nazwa firmy *
                        </AppText>
                        <AppTextInput
                            value={name}
                            onChangeText={setName}
                            fullWidth
                            errorMessage={errors.name}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            NIP *
                        </AppText>
                        <AppTextInput
                            value={formatNip(taxId)}
                            onChangeText={(text) => setTaxId(text.replace(/\D/g, ''))}
                            fullWidth
                            keyboardType="number-pad"
                            errorMessage={errors.taxId}
                        />
                    </View>

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

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            E-mail
                        </AppText>
                        <AppTextInput value={email} onChangeText={setEmail} fullWidth />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Telefon
                        </AppText>
                        <AppTextInput value={phone} onChangeText={setPhone} fullWidth />
                    </View>

                    <ActionButtons />
                </AppCard>
            </View>
        </ScrollView>
    );
};
