import { AppCard, AppDropdown, AppText, AppTextInput } from '@/components/common';
import { AppCurrencyInput } from '@/components/common/AppCurrencyInput';
import { AppTagList } from '@/components/common/tag/AppTagList';
import { metrics } from '@/theme/metrics';
import { Currency } from '@/types/common';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export default function AddProductScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // stan dla ceny
    const [netPrice, setNetPrice] = useState<number | null>(null);
    const [vatRate, setVatRate] = useState<number>(23); // domyślnie 23%
    const [currency, setCurrency] = useState<Currency>(Currency.PLN);

    const categories = [
        { label: 'Laptopy', value: 'laptops' },
        { label: 'Smartfony', value: 'smartphones' },
        { label: 'Akcesoria', value: 'accessories' },
        { label: 'Monitory', value: 'monitors' },
    ];

    const handleTagSelect = (value: string) => {
        setSelectedTags((prev) =>
            prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
        );
    };

    // obliczone wartości VAT i brutto
    const vatValue = netPrice != null ? (netPrice * vatRate) / 100 : 0;
    const grossPrice = netPrice != null ? netPrice + vatValue : 0;

    return (
        <View style={styles.container}>
            <AppText variant="headlineLarge" style={styles.screenTitle}>
                Nowy Produkt
            </AppText>

            <View style={styles.cardsRow}>
                <AppCard style={styles.cardMain}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Informacje ogólne
                    </AppText>
                    <AppText>Nazwa produktu</AppText>
                    <AppTextInput fullWidth />
                    <AppText>Opis produktu</AppText>
                    <AppTextInput fullWidth height={100} />
                </AppCard>

                <AppCard style={styles.cardSide}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Kategoria
                    </AppText>

                    <AppText>Kategoria produktu</AppText>
                    <AppDropdown
                        fullWidth
                        label=""
                        options={categories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    <AppText style={{ marginTop: metrics.spacing.md }}>Tagi produktu</AppText>
                    <AppDropdown
                        fullWidth
                        label=""
                        options={categories}
                        value={''}
                        onChange={handleTagSelect}
                    />

                    <AppTagList
                        tags={categories}
                        selectedValues={selectedTags}
                        onRemove={handleTagSelect}
                    />
                </AppCard>
            </View>

            <View style={styles.cardsRow}>
                <AppCard style={styles.cardMain}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Cena
                    </AppText>

                    <AppText>Cena netto</AppText>
                    <AppCurrencyInput
                        fullWidth
                        value={netPrice}
                        onChangeValue={setNetPrice}
                        currency={currency}
                        onChangeCurrency={setCurrency}
                    />

                    <AppText>Stawka VAT (%)</AppText>
                    <View style={styles.vatRow}>
                        <AppTextInput
                            value={vatRate.toString()}
                            onChangeText={(t) => setVatRate(Number(t))}
                            keyboardType="numeric"
                            placeholder="VAT %"
                            style={{ flex: 1, marginRight: metrics.spacing.sm }}
                        />
                        <AppCurrencyInput
                            value={vatValue}
                            currency={currency}
                            editable={false}
                            style={styles.vatValue}
                        />
                        <AppCurrencyInput
                            value={grossPrice}
                            currency={currency}
                            editable={false}
                            style={styles.vatGross}
                        />
                    </View>
                </AppCard>

                <AppCard style={styles.cardSide}>
                    <AppText variant="headlineSmall" style={styles.cardTitle}>
                        Kategoria
                    </AppText>

                    <AppText>Kategoria produktu</AppText>
                    <AppDropdown
                        fullWidth
                        label=""
                        options={categories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    <AppText style={{ marginTop: metrics.spacing.md }}>Tagi produktu</AppText>
                    <AppDropdown
                        fullWidth
                        label=""
                        options={categories}
                        value={''}
                        onChange={handleTagSelect}
                    />

                    <AppTagList
                        tags={categories}
                        selectedValues={selectedTags}
                        onRemove={handleTagSelect}
                    />
                </AppCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: metrics.spacing.lg,
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
    },
    cardSide: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    cardTitle: {
        marginBottom: metrics.spacing.md,
    },
    vatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 'auto',
        gap: metrics.spacing.sm,
    },
    vatValue: {
        flex: 1, // reszta dla wartości netto/brutto
        marginRight: metrics.spacing.sm,
    },
    vatGross: {
        flex: 1,
    },
});
