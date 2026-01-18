import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppText, AppCard, AppButton, AppTextInput } from '@/components/common';

import { metrics } from '@/theme/metrics';
import { AppImageUpload } from '@/components/common/AppImageUpload';
import { AppDropdown, DropdownOption } from '@/components/common/AppDropdown';
import { AppNumberInput } from '@/components/common/AppNumberInput';
import { validateProduct } from '@/validators/productValidator';
import { useCreateProduct, useProduct, useUpdateProduct } from '@/composables/product/useProducts';
import { CreateProductPayload, UpdateProductPayload } from '@/types/dto';
import { useCategories } from '@/composables/category';
import { useCompanies } from '@/composables/company/useCompanies';
import { AppAutocomplete } from '@/components/common/AppAutocomplete';
import { LoadingScreen } from '..';
import { ErrorMessage } from '@/components/common/AppStageMessage';

const DIMENSION_INPUT_WIDTH = 150;
const DESCRIPTION_NUMBER_OF_LINES = 6;

export const ProductAddEditScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();

    const { id } = route.params ?? {};
    const isEdit = Boolean(id);

    const { data: fetchedProduct, error: fetchProductError, loading: fetchProductLoading, refresh } = useProduct(id);
    const { data: categoriesData, loading: categoriesLoading } = useCategories();

    const [searchManufacturer, setSearchManufacturer] = useState('')
    const { data: manufacturersData, loading: manufacturersLoading } = useCompanies(true, {
        name: searchManufacturer,
    });
    const { create, loading: createLoading } = useCreateProduct(() => navigation.goBack());
    const { update, loading: updateLoading } = useUpdateProduct(() => navigation.goBack());

    const categoryOptions = useMemo(() => {
        return categoriesData.map((cat) => ({
            label: cat.name,
            value: cat.id,
        }));
    }, [categoriesData]);

    const manufacturerOptions = useMemo(() => {
        return manufacturersData.map((man) => ({
            label: man.name,
            value: man.id,
        }));
    }, [manufacturersData]);

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [netPrice, setNetPrice] = useState('0');
    const [vatRate, setVatRate] = useState('23');
    const [stockQuantity, setStockQuantity] = useState('0');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [manufacturerId, setManufacturerId] = useState('');
    // const [countryOfOrigin, setCountryOfOrigin] = useState('');
    // const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    // const [material, setMaterial] = useState('');
    // const [color, setColor] = useState('');
    // const [warranty, setWarranty] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit && fetchedProduct) {
            setName(fetchedProduct.name);
            setSku(fetchedProduct.sku);
            setCategoryId(fetchedProduct.categoryId || '');
            setNetPrice(String(fetchedProduct.netPrice));
            setVatRate(String(fetchedProduct.vatRate));
            setStockQuantity(String(fetchedProduct.stockQuantity));
            setImageUrl(fetchedProduct.imageUrl);
            setDescription(fetchedProduct.description || '');
            setManufacturerId(fetchedProduct.manufacturer.id || '');
            // setCountryOfOrigin(fetchedProduct.specification?.countryOfOrigin || '');
            // setWeight(fetchedProduct.specification?.weight?.toString() || '');
            setLength(fetchedProduct.dimensions?.length?.toString() || '');
            setWidth(fetchedProduct.dimensions?.width?.toString() || '');
            setHeight(fetchedProduct.dimensions?.height?.toString() || '');
            // setMaterial(fetchedProduct.specification?.material || '');
            // setColor(fetchedProduct.specification?.color || '');
            // setWarranty(fetchedProduct.specification?.warranty?.toString() || '');
        }
    }, [fetchedProduct, isEdit]);

    const pageTitle = isEdit ? `Edycja produktu ${name || ''}` : 'Dodaj nowy produkt';
    const loading = createLoading || updateLoading || fetchProductLoading || categoriesLoading;

    const validate = (): boolean => {
        const input = {
            name,
            sku,
            categoryId,
            netPrice,
            vatRate,
            stockQuantity,
            manufacturerId,
            // countryOfOrigin,
            // weight,
            length,
            width,
            height,
            // warranty,
            description,
        };
        const newErrors = validateProduct(input);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const payload: CreateProductPayload = {
            name,
            sku,
            manufacturerId: manufacturerId,
            netPrice: Number(netPrice),
            vatRate: Number(vatRate),
            stockQuantity: Number(stockQuantity),
            description: description,
            categoryId: categoryId,
            dimensions: {
                length: Number(length),
                width: Number(width),
                height: Number(height),
            },
        };

        try {
            if (isEdit && id) {
                await update(id, payload as UpdateProductPayload);
            } else {
                // CreateProductPayload
                await create(payload);
            }
        } catch (err) {
            console.error('Błąd podczas zapisu:', err);
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
            justifyContent: 'space-between',
            gap: metrics.spacing.md,
            marginBottom: metrics.spacing.md,
            width: '100%',
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


    if (loading) {
        return <LoadingScreen text="Ładowanie danych..." />;
    }

    if (fetchProductError) {
        return (
            <ErrorMessage
                error={fetchProductError}
                onRetry={refresh}
                onBack={() => navigation.goBack()}
            />
        );
    }

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

                    {/* <View style={styles.inputRow}>
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
                    </View> */}

                    <View style={styles.inputRow}>
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Kategoria *
                        </AppText>
                        <AppDropdown
                            label=""
                            fullWidth
                            value={categoryId}
                            onChange={setCategoryId}
                            options={categoryOptions}
                            disabled={categoriesLoading}
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
                                fullWidth
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
                                fullWidth
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
                        {/* <View style={styles.inputRow}>
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
                        </View> */}
{/* 
                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Producent *
                        </AppText> */}
                        {/* <AppDropdown
                            label=""
                            fullWidth
                            value={manufacturerId}
                            onChange={setManufacturerId}
                            options={manufacturerOptions}
                            disabled={manufacturersLoading}
                            errorMessage={errors.manufacturerId}
                        /> */}

                        <AppAutocomplete<DropdownOption>
                            label="Producent"
                            placeholder="Szukaj producenta..."
                            value={manufacturerOptions.find((opt) => opt.value === manufacturerId)}
                            options={manufacturerOptions}
                            getOptionLabel={(option) => option.label}
                            onInputChange={(text) => setSearchManufacturer(text)} 
                            onChange={(selectedOption) => {
                                setManufacturerId(selectedOption?.value || '');
                            }}
                            errorMessage={errors.manufacturerId}
                            // inputProps={{
                            //     right: manufacturersLoading ? <TextInput.Icon icon="loading" /> : null
                            // }}
                        />

                        {/* <View style={styles.inputRow}>
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
                        </View> */}

                        {/* <View style={styles.inputRow}>
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
                        </View> */}

                        <AppText variant="bodyMedium" style={styles.inputLabel}>
                            Wymiary (cm)
                        </AppText>

                        <View style={styles.flexInputRow}>
                            <View style={styles.flexInputWrapper}>
                                <AppNumberInput
                                    value={length}
                                    fullWidth
                                    onChangeValue={setLength}
                                    placeholder="Długość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.length}
                                />
                            </View>
                            <View style={styles.flexInputWrapper}>
                                <AppNumberInput
                                    value={width}
                                    fullWidth
                                    onChangeValue={setWidth}
                                    placeholder="Szerokość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.width}
                                />
                            </View>
                            <View style={styles.flexInputWrapper}>
                                <AppNumberInput
                                    value={height}
                                    fullWidth
                                    onChangeValue={setHeight}
                                    placeholder="Wysokość"
                                    width={DIMENSION_INPUT_WIDTH}
                                    errorMessage={errors.height}
                                />
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.verticalDivider} /> */}

                    {/* <View style={styles.specColumn}>
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
                    </View> */}
                </View>

                {/* <View style={styles.divider} /> */}

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
