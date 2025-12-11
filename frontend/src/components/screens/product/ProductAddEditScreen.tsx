import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';

import { metrics } from '@/theme/metrics';
import { ProductDetails } from '@/types/domain/product';
import { AppImageUpload } from '@/components/common/AppImageUpload';
import { AppDropdown } from '@/components/common/AppDropdown';
import { AppNumberInput } from '@/components/common/AppNumberInput';
import { validateProduct, ProductValidationErrors } from '@/validators/productValidator';

const mockCategories = [
    { label: 'Zwierzęta domowe', value: 'cat-animals' },
    { label: 'Narzędzia', value: 'cat-tools' },
    { label: 'Elektronika', value: 'cat-electronics' },
];

const EMPTY_PRODUCT: ProductDetails = {
    id: '',
    name: '',
    sku: '',
    description: '',
    stockQuantity: 0,
    categoryId: '',
    category: undefined,
    netPrice: 0,
    vatRate: 0,
    grossPrice: 0,
    vatAmount: 0,
    currency: 'PLN',
    imageUrl: null,
    specification: {
        productId: '',
        weight: null,
        dimensions: { length: 0, width: 0, height: 0 },
        material: '',
        color: '',
        manufacturer: '',
        countryOfOrigin: '',
        warranty: null,
    },
    createdAt: '',
    updatedAt: '',
    lastRestockedAt: '',
};

const mockProduct: ProductDetails = {
    id: '123',
    name: 'Rudy kotek',
    sku: 'RUDY-2025-001',
    stockQuantity: 1,
    description: 'Mały, rudy kotek o puszystym futerku i dużych zielonych oczach',
    categoryId: 'cat-animals',
    category: { id: 'cat-animals', name: 'Zwierzęta domowe', description: '', products: [] },
    netPrice: 0,
    vatRate: 0,
    grossPrice: 0,
    vatAmount: 0,
    currency: 'PLN',
    imageUrl: 'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764505258/rudy_c7ebby.png',
    specification: {
        productId: '123',
        weight: 3.2,
        dimensions: { length: 40, width: 15, height: 25 },
        material: 'Futro + kości + mięśnie',
        color: 'Rudy',
        manufacturer: 'Mother Nature',
        countryOfOrigin: 'Polska',
        warranty: 0,
    },
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-11-30T10:00:00Z',
    lastRestockedAt: '2025-11-25T09:00:00Z',
};

const DIMENSION_INPUT_WIDTH = 150;
const DESCRIPTION_NUMBER_OF_LINES = 6;

export const ProductAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);
    const initial = isEdit ? mockProduct : EMPTY_PRODUCT;

    const [name, setName] = useState(initial.name);
    const [sku, setSku] = useState(initial.sku);
    const [categoryId, setCategoryId] = useState(initial.categoryId || '');

    const pageTitle = isEdit ? `Edycja produktu ${name || ''}` : 'Dodaj nowy produkt';

    const [netPrice, setNetPrice] = useState(initial.netPrice.toString());
    const [vatRate, setVatRate] = useState(initial.vatRate.toString());
    const [stockQuantity, setStockQuantity] = useState(initial.stockQuantity.toString());

    const [imageUrl, setImageUrl] = useState(initial.imageUrl);

    const [description, setDescription] = useState(initial.description || '');
    const [manufacturer, setManufacturer] = useState(initial.specification?.manufacturer || '');
    const [countryOfOrigin, setCountryOfOrigin] = useState(
        initial.specification?.countryOfOrigin || ''
    );

    const [weight, setWeight] = useState(initial.specification?.weight?.toString() || '');
    const [length, setLength] = useState(
        initial.specification?.dimensions?.length?.toString() || ''
    );
    const [width, setWidth] = useState(initial.specification?.dimensions?.width?.toString() || '');
    const [height, setHeight] = useState(
        initial.specification?.dimensions?.height?.toString() || ''
    );

    const [material, setMaterial] = useState(initial.specification?.material || '');
    const [color, setColor] = useState(initial.specification?.color || '');
    const [warranty, setWarranty] = useState(initial.specification?.warranty?.toString() || '');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const input = {
            name,
            sku,
            categoryId,
            netPrice,
            vatRate,
            stockQuantity,
            manufacturer,
            countryOfOrigin,
            weight,
            length,
            width,
            height,
            warranty,
            description,
        };

        const newErrors: ProductValidationErrors = validateProduct(input);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const payload = {
            name,
            sku,
            categoryId,
            netPrice: Number(netPrice),
            vatRate: Number(vatRate),
            stockQuantity: Number(stockQuantity),
            imageUrl,
            description,
            specification: {
                manufacturer,
                countryOfOrigin,
                weight: Number(weight),
                dimensions: {
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                },
                material,
                color,
                warranty: Number(warranty),
            },
        };

        if (isEdit) {
            console.log('➡️ Aktualizacja produktu:', { id, ...payload });
        } else {
            console.log('🆕 Tworzenie nowego produktu:', payload);
        }

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
        imageContainer: { width: '45%' },
        card: { flex: 1, marginVertical: 0, backgroundColor: theme.colors.background },
        specCard: {
            width: '100%',
            marginVertical: 0,
            marginBottom: metrics.spacing.xl,
            backgroundColor: theme.colors.background,
        },
        specRow: {
            flexDirection: 'row',
            gap: metrics.spacing.lg,
            marginBottom: metrics.spacing.lg,
        },
        specColumn: { flex: 1 },
        verticalDivider: {
            width: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginHorizontal: metrics.spacing.md,
        },
        cardTitle: { marginBottom: metrics.spacing.md },
        sectionTitle: { marginTop: metrics.spacing.sm, marginBottom: metrics.spacing.sm },
        inputRow: { marginBottom: metrics.spacing.md },
        inputLabel: {
            marginBottom: metrics.spacing.xs,
            color: theme.colors.onSurfaceVariant,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginVertical: metrics.spacing.md,
        },
        flexInputRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
            marginBottom: metrics.spacing.md,
        },
        flexInputWrapper: { flex: 1 },
        button: { minWidth: 160 },
        dimensionsRow: { flexDirection: 'row', gap: metrics.spacing.md },
        dimensionInput: { flex: 1 },
    });

    const ActionButtons = () => (
        <View style={styles.actionRow}>
            <AppButton onPress={handleCancel} style={styles.button} mode="outlined">
                Anuluj
            </AppButton>
            <AppButton onPress={handleSave} style={styles.button} mode="contained">
                {isEdit ? 'Zapisz zmiany' : 'Dodaj produkt'}
            </AppButton>
        </View>
    );

    const HeaderRow = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <AppText variant="headlineMedium">{pageTitle}</AppText>

            <View style={{ flexDirection: 'row', gap: metrics.spacing.md }}>
                <ActionButtons />
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <HeaderRow />

            <View style={styles.contentRow}>
                <View style={styles.imageContainer}>
                    <AppImageUpload
                        imageUrl={imageUrl}
                        onImageSelected={setImageUrl}
                        onImageRemoved={() => setImageUrl(null)}
                    />
                </View>

                <AppCard style={styles.card}>
                    <AppText variant="titleLarge" style={styles.cardTitle}>
                        Informacje podstawowe
                    </AppText>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Nazwa produktu *
                        </AppText>
                        <AppTextInput
                            value={name}
                            fullWidth
                            onChangeText={setName}
                            placeholder="Wprowadź nazwę produktu"
                            errorMessage={errors.name}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            SKU *
                        </AppText>
                        <AppTextInput
                            value={sku}
                            fullWidth
                            onChangeText={setSku}
                            placeholder="Wprowadź SKU"
                            errorMessage={errors.sku}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Kategoria *
                        </AppText>
                        <AppDropdown
                            label=""
                            fullWidth
                            value={categoryId}
                            onChange={setCategoryId}
                            options={mockCategories}
                            errorMessage={errors.categoryId}
                        />
                    </View>

                    <View style={styles.flexInputRow}>
                        <View style={styles.flexInputWrapper}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Cena netto (PLN) *
                            </AppText>
                            <AppTextInput
                                value={netPrice}
                                onChangeText={setNetPrice}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                errorMessage={errors.netPrice}
                            />
                        </View>

                        <View style={styles.flexInputWrapper}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Stawka VAT (%) *
                            </AppText>
                            <AppTextInput
                                value={vatRate}
                                onChangeText={setVatRate}
                                placeholder="23"
                                keyboardType="decimal-pad"
                                errorMessage={errors.vatRate}
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Dane magazynowe
                    </AppText>

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Stan magazynowy *
                        </AppText>
                        <AppNumberInput
                            value={stockQuantity}
                            onChangeValue={(val) =>
                                setStockQuantity(String(Math.max(0, parseInt(val) || 0)))
                            }
                            allowDecimal={false}
                            allowNegative={false}
                            fullWidth
                            errorMessage={errors.stockQuantity}
                        />
                    </View>
                </AppCard>
            </View>

            <AppCard style={styles.specCard}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Specyfikacja produktu
                </AppText>

                <View style={styles.specRow}>
                    <View style={styles.specColumn}>
                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Producent
                            </AppText>
                            <AppTextInput
                                value={manufacturer}
                                fullWidth
                                onChangeText={setManufacturer}
                                placeholder="Wprowadź producenta"
                                errorMessage={errors.manufacturer}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Kraj pochodzenia
                            </AppText>
                            <AppTextInput
                                value={countryOfOrigin}
                                fullWidth
                                onChangeText={setCountryOfOrigin}
                                placeholder="Wprowadź kraj pochodzenia"
                                errorMessage={errors.countryOfOrigin}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Waga (kg)
                            </AppText>
                            <AppNumberInput
                                value={weight}
                                fullWidth
                                onChangeValue={setWeight}
                                placeholder="0.0"
                                errorMessage={errors.weight}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Wymiary (cm)
                            </AppText>

                            <View style={{ flexDirection: 'row', gap: metrics.spacing.md }}>
                                <AppNumberInput
                                    value={length}
                                    onChangeValue={setLength}
                                    placeholder="Długość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.length}
                                />

                                <AppNumberInput
                                    value={width}
                                    onChangeValue={setWidth}
                                    placeholder="Szerokość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.width}
                                />

                                <AppNumberInput
                                    value={height}
                                    onChangeValue={setHeight}
                                    placeholder="Wysokość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.height}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.verticalDivider} />

                    <View style={styles.specColumn}>
                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Materiał
                            </AppText>
                            <AppTextInput
                                value={material}
                                fullWidth
                                onChangeText={setMaterial}
                                placeholder="Wprowadź materiał"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Kolor
                            </AppText>
                            <AppTextInput
                                value={color}
                                fullWidth
                                onChangeText={setColor}
                                placeholder="Wprowadź kolor"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <AppText variant="bodyMedium" style={styles.inputLabel}>
                                Gwarancja (w miesiącach)
                            </AppText>
                            <AppTextInput
                                value={warranty}
                                fullWidth
                                onChangeText={setWarranty}
                                placeholder="0"
                                keyboardType="number-pad"
                                errorMessage={errors.warranty}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.inputRow}>
                    <AppText variant="titleLarge" style={styles.inputLabel}>
                        Opis produktu
                    </AppText>
                    <AppTextInput
                        value={description}
                        fullWidth
                        height={200}
                        onChangeText={setDescription}
                        placeholder="Wprowadź opis produktu"
                        multiline
                        numberOfLines={DESCRIPTION_NUMBER_OF_LINES}
                        errorMessage={errors.description}
                    />
                </View>
            </AppCard>

            <ActionButtons />
        </ScrollView>
    );
};
