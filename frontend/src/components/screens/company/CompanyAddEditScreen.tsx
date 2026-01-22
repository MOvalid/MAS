import React, { useState, useRef } from 'react';
import { 
    View, 
    StyleSheet, 
    ScrollView, 
    LayoutChangeEvent, 
    Alert, 
    ActivityIndicator, 
    Animated 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { Company } from '@/types/domain/company';
import { formatNip } from '@/utils/formatters';
import {
    CreateCompanyPayload,
    useCreateCompany,
    useUpdateCompany,
} from '@/composables/company/useCompanies';
import { CompanyDto } from '@/types/dto';

const CompanyImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764533804/modern-urban-buildings-view_vhmzbe.jpg';

const EMPTY_COMPANY: Company = {
    id: '',
    name: '',
    taxId: '',
    address: { street: '', houseNumber: '', city: '', postalCode: '', country: '' },
    email: '',
    phoneNumber: '',
};

export const CompanyAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const imageOpacity = useRef(new Animated.Value(0)).current;
    const [isImageLoading, setIsImageLoading] = useState(true);

    const { company: companyToEdit } = (route.params as { company?: Company }) ?? {};
    const isEdit = Boolean(companyToEdit?.id);
    const initial = isEdit ? companyToEdit! : EMPTY_COMPANY;

    const [name, setName] = useState(initial.name);
    const [taxId, setTaxId] = useState(initial.taxId);
    const [street, setStreet] = useState(initial.address.street);
    const [houseNumber, setHouseNumber] = useState(initial.address.houseNumber);
    const [city, setCity] = useState(initial.address.city);
    const [postalCode, setPostalCode] = useState(initial.address.postalCode);
    const [country, setCountry] = useState(initial.address.country);
    const [email, setEmail] = useState(initial.email || '');
    const [phone, setPhone] = useState(initial.phoneNumber || '');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cardHeight, setCardHeight] = useState<number>(0);

    const { create, loading: isCreating } = useCreateCompany(
        () => {
            console.log('Sukces: Firma dodana');
            navigation.goBack();
        },
        (err) => Alert.alert('Błąd', err)
    );

    const { update, loading: isUpdating } = useUpdateCompany(
        () => {
            console.log('Sukces: Firma zaktualizowana');
            navigation.goBack();
        },
        (err) => Alert.alert('Błąd', err)
    );

    const isLoading = isCreating || isUpdating;
    const pageTitle = isEdit ? `Edycja firmy ${name || ''}` : 'Dodaj nową firmę';

    const onLoad = () => {
        Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => setIsImageLoading(false));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!name) newErrors.name = 'Nazwa firmy jest wymagana';
        if (!taxId) newErrors.taxId = 'NIP jest wymagany';
        if (!/^\d{10}$/.test(taxId)) newErrors.taxId = 'NIP musi składać się z 10 cyfr';
        if (!street) newErrors.street = 'Ulica jest wymagana';
        if (!houseNumber) newErrors.houseNumber = 'Numer jest wymagany';
        if (!city) newErrors.city = 'Miasto jest wymagane';
        if (!postalCode) newErrors.postalCode = 'Kod pocztowy jest wymagany';
        if (!country) newErrors.country = 'Kraj jest wymagany';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            name,
            taxId,
            address: { street, houseNumber, city, postalCode, country },
            email: email?.trim() || undefined,
            phone: phone?.trim() || undefined,
        };

        if (isEdit && companyToEdit) {
            await update(companyToEdit.id, { ...payload, id: companyToEdit.id } as CompanyDto);
        } else {
            await create(payload as CreateCompanyPayload);
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
        imageContainer: { 
            width: '45%', 
            marginVertical: metrics.spacing.sm,
            position: 'relative',
            borderRadius: metrics.radius.lg,
            overflow: 'hidden'
        },
        imagePlaceholder: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.surfaceVariant,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
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
                    {isImageLoading && (
                        <View style={[styles.imagePlaceholder, { height: cardHeight }]}>
                            <ActivityIndicator color={theme.colors.primary} />
                        </View>
                    )}
                    <Animated.Image
                        source={{ uri: CompanyImage }}
                        onLoad={onLoad}
                        style={[
                            styles.image, 
                            { 
                                height: cardHeight,
                                opacity: imageOpacity 
                            }
                        ]}
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
                            editable={!isLoading}
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
                            value={houseNumber}
                            onChangeText={setHouseNumber}
                            fullWidth
                            errorMessage={errors.houseNumber}
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

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            E-mail
                        </AppText>
                        <AppTextInput
                            value={email}
                            onChangeText={setEmail}
                            fullWidth
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
                            editable={!isLoading}
                        />
                    </View>

                    <ActionButtons />
                </AppCard>
            </View>
        </ScrollView>
    );
};
