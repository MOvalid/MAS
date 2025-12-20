import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { formatPolishDate } from '@/utils/formatters';
import { calculateVat } from '@/utils/price-utils';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import { getFriendlyErrorMessage } from '@/utils/error-utils';
import { ErrorScreen } from '../ErrorScreen';
import { LoadingScreen } from '../LoadingScreen';
import { useProductDetails } from '@/composables/product';

const NotAvailableImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764505262/not-available_kyzgum.png';

export const ProductDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;

    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Use the hook to fetch product details
    const {
        item: product,
        loading,
        error,
        notFound,
        refetch: refresh,
    } = useProductDetails(id, true);

    const getStockStatus = (stockQuantity: number) => {
        if (stockQuantity === 0) return { text: 'Brak w magazynie', color: theme.colors.error };
        if (stockQuantity <= 20) return { text: 'Niski stan', color: theme.colors.warning };
        return { text: 'Dostępny', color: theme.colors.success };
    };

    const handleEdit = () => {
        if (product) {
            navigation.navigate('ProductEdit', { id: product.id });
        }
    };

    const handleDelete = () => {
        console.log('Usuwanie produktu:', product?.id);
        setDeleteModalVisible(false);
        navigation.goBack();
    };

    const styles = StyleSheet.create({
        buttonRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
        },
        button: {
            minWidth: 160,
        },
        deleteButton: {
            backgroundColor: theme.colors.error,
        },
        container: {
            flex: 1,
            padding: metrics.spacing.lg,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: metrics.spacing.xl,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: metrics.spacing.xl,
        },
        errorText: {
            marginBottom: metrics.spacing.lg,
            textAlign: 'center',
            color: theme.colors.error,
        },
        title: {
            marginBottom: metrics.spacing.xs,
        },
        subtitle: {
            marginBottom: metrics.spacing.xl,
            color: theme.colors.onSurfaceVariant,
        },
        contentRow: {
            flexDirection: 'row',
            gap: metrics.spacing.xl,
            alignItems: 'stretch',
            marginBottom: metrics.spacing.xl,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        imageContainer: {
            width: '45%',
            aspectRatio: 1,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: metrics.radius.md,
        },
        card: {
            flex: 1,
            marginVertical: 0,
            backgroundColor: theme.colors.background,
        },
        specCard: {
            width: '100%',
            marginVertical: 0,
            marginBottom: metrics.spacing.xl,
            backgroundColor: theme.colors.background,
        },
        cardTitle: {
            marginBottom: metrics.spacing.md,
        },
        sectionTitle: {
            marginTop: metrics.spacing.sm,
            marginBottom: metrics.spacing.sm,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: metrics.spacing.sm,
        },
        label: {
            fontWeight: metrics.fontWeight.semibold,
            color: theme.colors.onSurfaceVariant,
            marginRight: metrics.spacing.md,
            width: 180,
        },
        value: {
            textAlign: 'left',
            flex: 1,
        },
        priceGross: {
            fontWeight: metrics.fontWeight.bold,
        },
        stockText: {
            fontWeight: metrics.fontWeight.semibold,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginVertical: metrics.spacing.md,
        },
        noData: {
            color: theme.colors.onSurfaceVariant,
        },
        modalTitle: {
            marginBottom: metrics.spacing.md,
            textAlign: 'center',
        },
        modalText: {
            marginBottom: metrics.spacing.xl,
            textAlign: 'center',
        },
        modalButtons: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
        },
        modalButton: {
            flex: 1,
        },
    });

    if (loading) {
        return <LoadingScreen />;
    }

    if (!!notFound || !!error) {
        const friendly = getFriendlyErrorMessage(error);

        return (
            <ErrorScreen
                title="Nie udało się pobrać danych"
                message={friendly.message}
                onRetry={refresh}
            />
        );
    }

    if (!product) {
        // Opcjonalnie możesz też pokazać placeholder zamiast null
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <AppText>Brak danych</AppText>
            </View>
        );
    }

    const stockStatus = getStockStatus(product.stockQuantity);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <AppText variant="headlineMedium" style={styles.title}>
                        {product.name}
                    </AppText>
                    <AppText style={styles.subtitle}>SKU: {product.sku}</AppText>
                </View>
                <View style={styles.buttonRow}>
                    <AppButton icon={IconName.edit} onPress={handleEdit} style={styles.button}>
                        Edytuj produkt
                    </AppButton>
                    <AppButton
                        icon={IconName.delete}
                        onPress={() => setDeleteModalVisible(true)}
                        style={[styles.button, styles.deleteButton]}
                        mode="contained"
                    >
                        Usuń produkt
                    </AppButton>
                </View>
            </View>

            <View style={styles.contentRow}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.imageUrl || NotAvailableImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <AppCard style={styles.card}>
                    <AppText variant="titleLarge" style={styles.cardTitle}>
                        Informacje podstawowe
                    </AppText>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            Kategoria:
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.value}>
                            {product.category?.name || '-'}
                        </AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            Cena netto:
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.value}>
                            {product.netPrice.toFixed(2)} {product.currency}
                        </AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            VAT ({product.vatRate}%):
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.value}>
                            {calculateVat(product.netPrice, product.vatRate).toFixed(2)}{' '}
                            {product.currency}
                        </AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            Cena brutto:
                        </AppText>
                        <AppText variant="bodyLarge" style={[styles.priceGross, styles.value]}>
                            {product.grossPrice.toFixed(2)} {product.currency}
                        </AppText>
                    </View>

                    <View style={styles.divider} />

                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Dane magazynowe
                    </AppText>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            Stan magazynowy:
                        </AppText>
                        <AppText
                            variant="bodyLarge"
                            style={[styles.stockText, styles.value, { color: stockStatus.color }]}
                        >
                            {product.stockQuantity} szt. ({stockStatus.text})
                        </AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText variant="bodyLarge" style={styles.label}>
                            Ostatnie uzupełnienie:
                        </AppText>
                        <AppText variant="bodyLarge" style={styles.value}>
                            {formatPolishDate(product.lastRestockedAt, false)}
                        </AppText>
                    </View>
                </AppCard>
            </View>

            <AppCard style={styles.specCard}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Specyfikacja produktu
                </AppText>

                {product.specification ? (
                    <>
                        {product.specification.manufacturer && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Producent:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.manufacturer}
                                </AppText>
                            </View>
                        )}

                        {product.specification.countryOfOrigin && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Kraj pochodzenia:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.countryOfOrigin}
                                </AppText>
                            </View>
                        )}

                        {product.specification.weight && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Waga:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.weight} kg
                                </AppText>
                            </View>
                        )}

                        {product.specification.dimensions && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Wymiary (D×S×W):
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.dimensions.length} ×{' '}
                                    {product.specification.dimensions.width} ×{' '}
                                    {product.specification.dimensions.height} cm
                                </AppText>
                            </View>
                        )}

                        {product.specification.material && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Materiał:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.material}
                                </AppText>
                            </View>
                        )}

                        {product.specification.color && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Kolor:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.color}
                                </AppText>
                            </View>
                        )}

                        {typeof product.specification.warranty === 'number' && (
                            <View style={styles.infoRow}>
                                <AppText variant="bodyLarge" style={styles.label}>
                                    Gwarancja:
                                </AppText>
                                <AppText variant="bodyLarge" style={styles.value}>
                                    {product.specification.warranty
                                        ? `${product.specification.warranty} miesięcy`
                                        : 'Brak'}
                                </AppText>
                            </View>
                        )}
                    </>
                ) : (
                    <AppText variant="bodyLarge" italic style={styles.noData}>
                        Brak specyfikacji
                    </AppText>
                )}

                {product.description && (
                    <>
                        <View style={styles.divider} />
                        <AppText variant="titleLarge" style={styles.sectionTitle}>
                            Opis
                        </AppText>
                        <AppText variant="bodyLarge">{product.description}</AppText>
                    </>
                )}
            </AppCard>

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń produkt
                </AppText>
                <AppText variant="bodyLarge" style={styles.modalText}>
                    Czy na pewno chcesz usunąć produkt "{product.name}"? Ta operacja jest
                    nieodwracalna.
                </AppText>
                <View style={styles.modalButtons}>
                    <AppButton
                        onPress={() => setDeleteModalVisible(false)}
                        style={styles.modalButton}
                        mode="outlined"
                    >
                        Anuluj
                    </AppButton>
                    <AppButton
                        onPress={handleDelete}
                        style={styles.modalButton}
                        mode="contained"
                        buttonColor={theme.colors.error}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
        </ScrollView>
    );
};
