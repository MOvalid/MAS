import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { AppButton, AppCard, AppDropdown, AppText, AppTextInput } from '@/components/common';
import { AppCurrencyInput } from '@/components/common/AppCurrencyInput';
import { AppTagList } from '@/components/common/tag/AppTagList';
import { metrics } from '@/theme/metrics';
import { Currency } from '@/types/common';
import { ProductFormValues } from '@/types/forms';

const categories = [
    { label: 'Laptopy', value: 'laptops' },
    { label: 'Smartfony', value: 'smartphones' },
    { label: 'Akcesoria', value: 'accessories' },
    { label: 'Monitory', value: 'monitors' },
];

export const ProductAddScreen = () => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        defaultValues: {
            name: '',
            description: '',
            sku: '',
            stockQuantity: 0,
            netPrice: 0,
            vatRate: 23,
            category: '',
            tags: [],
        },
    });

    const netPrice = watch('netPrice');
    const vatRate = watch('vatRate');
    const calculatedVat = (netPrice * vatRate) / 100;
    const grossPrice = netPrice + calculatedVat;

    const handleTagSelect = (value: string, selectedTags: string[]) => {
        const newTags = selectedTags.includes(value)
            ? selectedTags.filter((t) => t !== value)
            : [...selectedTags, value];
        setValue('tags', newTags);
    };

    const onSubmit = (data: ProductFormValues) => {
        console.log('Product data:', data);
    };

    return (
        <View style={styles.container}>
            <AppText variant="headlineLarge" style={styles.screenTitle}>
                Nowy Produkt
            </AppText>

            {/* Sekcja: Informacje ogólne */}
            <View style={styles.cardsRow}>
                <AppCard style={styles.cardMain}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Informacje ogólne
                    </AppText>

                    <AppText>Nazwa produktu</AppText>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'Nazwa produktu jest wymagana' }}
                        render={({ field: { value, onChange } }) => (
                            <AppTextInput
                                fullWidth
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <AppText>Opis produktu</AppText>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { value, onChange } }) => (
                            <AppTextInput
                                fullWidth
                                height={100}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </AppCard>

                {/* Sekcja: Kategoria i tagi */}
                <AppCard style={styles.cardSide}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Kategoria i tagi
                    </AppText>

                    <AppText>Kategoria produktu</AppText>
                    <Controller
                        control={control}
                        name="category"
                        rules={{ required: 'Wybierz kategorię' }}
                        render={({ field: { value, onChange } }) => (
                            <AppDropdown
                                fullWidth
                                options={categories}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    {errors.category && (
                        <AppText style={styles.errorText}>{errors.category.message}</AppText>
                    )}

                    <AppText style={{ marginTop: metrics.spacing.md }}>Tagi produktu</AppText>
                    <Controller
                        control={control}
                        name="tags"
                        render={({ field: { value } }) => (
                            <>
                                <AppDropdown
                                    fullWidth
                                    options={categories}
                                    value={''}
                                    onChange={(val) => handleTagSelect(val, value)}
                                />
                                <AppTagList
                                    tags={categories}
                                    selectedValues={value}
                                    onRemove={(val) => handleTagSelect(val, value)}
                                />
                            </>
                        )}
                    />
                </AppCard>
            </View>

            {/* Sekcja: Cena */}
            <View style={styles.cardsRow}>
                <AppCard style={styles.cardMain}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Cena
                    </AppText>

                    <AppText>Cena netto</AppText>
                    <Controller
                        control={control}
                        name="netPrice"
                        rules={{
                            required: 'Cena netto jest wymagana',
                            min: { value: 0, message: 'Cena nie może być ujemna' },
                        }}
                        render={({ field: { value, onChange } }) => (
                            <AppCurrencyInput
                                fullWidth
                                value={value}
                                onChangeValue={onChange}
                                currency={Currency.PLN}
                            />
                        )}
                    />

                    <View style={styles.vatRow}>
                        <View>
                            <AppText>Stawka VAT (%)</AppText>
                            <Controller
                                control={control}
                                name="vatRate"
                                rules={{ min: { value: 0, message: 'VAT nie może być ujemny' } }}
                                render={({ field: { value, onChange } }) => (
                                    <AppTextInput
                                        value={value.toString()}
                                        onChangeText={(t) => onChange(Number(t))}
                                    />
                                )}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <AppText>Wartość VAT</AppText>
                            <AppCurrencyInput
                                value={calculatedVat}
                                currency={Currency.PLN}
                                editable={false}
                                fullWidth
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <AppText>Cena brutto</AppText>
                            <AppCurrencyInput
                                value={grossPrice}
                                currency={Currency.PLN}
                                editable={false}
                                fullWidth
                            />
                        </View>
                    </View>
                </AppCard>

                {/* Sekcja: Magazyn */}
                <AppCard style={styles.cardSide}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Informacje magazynowe
                    </AppText>

                    <AppText>SKU</AppText>
                    <Controller
                        control={control}
                        name="sku"
                        rules={{ required: 'SKU jest wymagane' }}
                        render={({ field: { value, onChange } }) => (
                            <AppTextInput
                                fullWidth
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.sku?.message}
                            />
                        )}
                    />

                    <AppText>Ilość w magazynie</AppText>
                    <Controller
                        control={control}
                        name="stockQuantity"
                        rules={{
                            required: 'Ilość jest wymagana',
                            min: { value: 0, message: 'Nie może być ujemna' },
                        }}
                        render={({ field: { value, onChange } }) => (
                            <AppTextInput
                                fullWidth
                                value={value?.toString() || ''}
                                onChangeText={(t) => onChange(Number(t))}
                                errorMessage={errors.stockQuantity?.message}
                            />
                        )}
                    />
                </AppCard>
            </View>

            <AppButton onPress={handleSubmit(onSubmit)} style={styles.addButton}>
                Dodaj produkt
            </AppButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: metrics.spacing.lg,
        gap: metrics.spacing.lg,
    },
    screenTitle: {
        marginBottom: metrics.spacing.lg,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: metrics.spacing.lg,
        alignItems: 'stretch',
    },
    cardMain: {
        flex: 2,
        justifyContent: 'flex-start',
        marginBottom: metrics.spacing.lg,
    },
    cardSide: {
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: metrics.spacing.lg,
    },
    cardTitle: {
        marginBottom: metrics.spacing.md,
    },
    vatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.sm,
    },
    addButton: {
        alignSelf: 'flex-end',
        marginTop: metrics.spacing.md,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
});
