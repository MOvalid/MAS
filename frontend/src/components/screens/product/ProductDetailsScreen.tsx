import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { formatPolishDate } from '@/utils/formatters';
import { calculateVat } from '@/utils/price-utils';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import { ErrorScreen } from '../ErrorScreen';
import { LoadingScreen } from '../LoadingScreen';
import { useProduct, useDeleteProduct } from '@/composables/product/useProducts'; // Zaktualizowany import

const NotAvailableImage =
    'https://res.cloudinary.com/ddmjmidiw/image/upload/v1764505262/not-available_kyzgum.png';

export const ProductDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };

    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { data: product, loading, error, refresh } = useProduct(id);

    const { remove, loading: isDeleting } = useDeleteProduct(
        () => {
            setDeleteModalVisible(false);
            navigation.goBack();
            Alert.alert('Sukces', 'Produkt został usunięty');
        },
        (err) => {
            Alert.alert('Błąd', err);
        }
    );

    const getStockStatus = (stockQuantity: number) => {
        if (stockQuantity === 0) return { text: 'Brak w magazynie', color: theme.colors.error };
        if (stockQuantity <= 20) return { text: 'Niski stan', color: '#E6A23C' };
        return { text: 'Dostępny', color: '#67C23A' };
    };

    const handleEdit = () => {
        if (product) {
            navigation.navigate('ProductEdit', { id: product.id });
        }
    };

    const handleDelete = async () => {
        await remove(id);
    };

    const styles = createStyles(theme);

    if (loading) return <LoadingScreen />;

    if (error || !product) {
        return (
            <ErrorScreen
                title="Nie udało się pobrać danych"
                message={error || 'Produkt nie został znaleziony'}
                onRetry={refresh}
            />
        );
    }

    const stockStatus = getStockStatus(product.stockQuantity);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
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
                        loading={isDeleting}
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

                    <DetailRow
                        label="Kategoria:"
                        value={product.category?.name || '-'}
                        styles={styles}
                    />
                    <DetailRow
                        label="Cena netto:"
                        value={`${product.netPrice.toFixed(2)} ${product.currency}`}
                        styles={styles}
                    />
                    <DetailRow
                        label={`VAT (${product.vatRate}%):`}
                        value={`${calculateVat(product.netPrice, product.vatRate).toFixed(2)} ${product.currency}`}
                        styles={styles}
                    />
                    <DetailRow
                        label="Cena brutto:"
                        value={`${product.grossPrice.toFixed(2)} ${product.currency}`}
                        styles={styles}
                        valueStyle={styles.priceGross}
                    />

                    <View style={styles.divider} />

                    <AppText variant="titleLarge" style={styles.sectionTitle}>
                        Dane magazynowe
                    </AppText>

                    <DetailRow
                        label="Stan magazynowy:"
                        value={`${product.stockQuantity} szt. (${stockStatus.text})`}
                        styles={styles}
                        valueStyle={[styles.stockText, { color: stockStatus.color }]}
                    />
                    <DetailRow
                        label="Ostatnie uzupełnienie:"
                        value={formatPolishDate(product.lastRestockedAt, false)}
                        styles={styles}
                    />
                </AppCard>
            </View>

            <AppCard style={styles.specCard}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Specyfikacja produktu
                </AppText>

                {product.dimensions ? (
                    <>
                        {product.manufacturer && (
                            <DetailRow
                                label="Producent:"
                                value={product.manufacturer.name}
                                styles={styles}
                            />
                        )}
                        {/* {product.specification.countryOfOrigin && (
                            <DetailRow
                                label="Kraj pochodzenia:"
                                value={product.specification.countryOfOrigin}
                                styles={styles}
                            />
                        )}
                        {product.specification.weight && (
                            <DetailRow
                                label="Waga:"
                                value={`${product.specification.weight} kg`}
                                styles={styles}
                            />
                        )} */}
                        {product.dimensions && (
                            <DetailRow
                                label="Wymiary (D×S×W):"
                                value={`${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`}
                                styles={styles}
                            />
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
                        disabled={isDeleting}
                    >
                        Anuluj
                    </AppButton>
                    <AppButton
                        onPress={handleDelete}
                        style={styles.modalButton}
                        mode="contained"
                        buttonColor={theme.colors.error}
                        loading={isDeleting}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
        </ScrollView>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DetailRow = ({ label, value, styles, valueStyle }: any) => (
    <View style={styles.infoRow}>
        <AppText variant="bodyLarge" style={styles.label}>
            {label}
        </AppText>
        <AppText variant="bodyLarge" style={[styles.value, valueStyle]}>
            {value}
        </AppText>
    </View>
);

const createStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        container: { flex: 1, padding: metrics.spacing.lg },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: metrics.spacing.lg,
        },
        title: { marginBottom: metrics.spacing.xs },
        subtitle: { color: theme.colors.onSurfaceVariant, marginBottom: metrics.spacing.sm },
        buttonRow: { flexDirection: 'row', gap: metrics.spacing.md },
        button: { minWidth: 140 },
        deleteButton: { backgroundColor: theme.colors.error },
        contentRow: {
            flexDirection: 'row',
            gap: metrics.spacing.xl,
            marginBottom: metrics.spacing.xl,
        },
        imageContainer: { width: '40%', aspectRatio: 1 },
        image: { width: '100%', height: '100%', borderRadius: metrics.radius.md },
        card: { flex: 1, backgroundColor: theme.colors.surface, padding: metrics.spacing.md },
        specCard: { marginBottom: metrics.spacing.xl, padding: metrics.spacing.md },
        cardTitle: { marginBottom: metrics.spacing.md, fontWeight: 'bold' },
        sectionTitle: { marginVertical: metrics.spacing.sm, fontWeight: 'bold' },
        infoRow: { flexDirection: 'row', marginBottom: metrics.spacing.sm },
        label: { width: 150, color: theme.colors.onSurfaceVariant, fontWeight: '600' },
        value: { flex: 1 },
        priceGross: { fontWeight: 'bold', fontSize: 18 },
        stockText: { fontWeight: 'bold' },
        divider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginVertical: metrics.spacing.md,
        },
        noData: { color: theme.colors.onSurfaceVariant },
        modalTitle: { marginBottom: metrics.spacing.md, textAlign: 'center' },
        modalText: { marginBottom: metrics.spacing.xl, textAlign: 'center' },
        modalButtons: { flexDirection: 'row', gap: metrics.spacing.md },
        modalButton: { flex: 1 },
    });
