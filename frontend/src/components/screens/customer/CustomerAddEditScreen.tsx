import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, LayoutChangeEvent, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { Customer } from '@/types/domain/customer';
import {
    useCreateCustomer,
    useUpdateCustomer,
    CreateCustomerPayload,
} from '@/composables/customer/useCustomers';

const CustomerImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764539847/charlesdeluvio-rRWiVQzLm7k-unsplash_lpwbuq.jpg';

const EMPTY_CUSTOMER: Customer = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: { street: '', number: '', city: '', postalCode: '', country: '' },
    orders: [],
};

export const CustomerAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { customer: customerToEdit } = (route.params as { customer?: Customer }) ?? {};
    const isEdit = Boolean(customerToEdit?.id);
    const initial = isEdit ? customerToEdit! : EMPTY_CUSTOMER;

    // Form State
    const [firstName, setFirstName] = useState(initial.firstName);
    const [lastName, setLastName] = useState(initial.lastName);
    const [email, setEmail] = useState(initial.email || '');
    const [phone, setPhone] = useState(initial.phoneNumber || '');

    const [street, setStreet] = useState(initial.address?.street || '');
    const [number, setNumber] = useState(initial.address?.number || '');
    const [city, setCity] = useState(initial.address?.city || '');
    const [postalCode, setPostalCode] = useState(initial.address?.postalCode || '');
    const [country, setCountry] = useState(initial.address?.country || '');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cardHeight, setCardHeight] = useState<number>(0);

    // Hooks
    const { create, loading: isCreating } = useCreateCustomer(
        () => {
            console.log('Sukces: Klient dodany');
            navigation.goBack();
        },
        (err) => Alert.alert('Błąd', err)
    );

    const { update, loading: isUpdating } = useUpdateCustomer(
        () => {
            console.log('Sukces: Dane klienta zaktualizowane');
            navigation.goBack();
        },
        (err) => Alert.alert('Błąd', err)
    );

    const isLoading = isCreating || isUpdating;
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

    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            firstName,
            lastName,
            email: email?.trim() || '',
            phoneNumber: phone?.trim() || null,
            address: { street, number, city, postalCode, country },
        };

        if (isEdit && customerToEdit) {
            await update(customerToEdit.id, { ...payload, id: customerToEdit.id } as Customer);
        } else {
            await create(payload as CreateCustomerPayload);
        }
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
            <AppButton
                onPress={handleCancel}
                style={styles.button}
                mode="outlined"
                disabled={isLoading}
            >
                Anuluj
            </AppButton>
            <AppButton
                onPress={handleSave}
                style={styles.button}
                mode="contained"
                loading={isLoading}
                disabled={isLoading}
            >
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
                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Imię *
                        </AppText>
                        <AppTextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            fullWidth
                            errorMessage={errors.firstName}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Nazwisko *
                        </AppText>
                        <AppTextInput
                            value={lastName}
                            onChangeText={setLastName}
                            fullWidth
                            errorMessage={errors.lastName}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            E-mail
                        </AppText>
                        <AppTextInput
                            value={email}
                            onChangeText={setEmail}
                            fullWidth
                            keyboardType="email-address"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Telefon
                        </AppText>
                        <AppTextInput
                            value={phone}
                            onChangeText={setPhone}
                            fullWidth
                            keyboardType="phone-pad"
                            editable={!isLoading}
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
                            editable={!isLoading}
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
                            editable={!isLoading}
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
                            editable={!isLoading}
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
                            editable={!isLoading}
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
                            editable={!isLoading}
                        />
                    </View>

                    <ActionButtons />
                </AppCard>
            </View>
        </ScrollView>
    );
};
