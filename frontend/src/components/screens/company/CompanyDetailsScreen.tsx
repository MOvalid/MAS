import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import { formatNip } from '@/utils/formatters';
import { useCompany, useDeleteCompany } from '@/composables/company/useCompanies';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorMessage, NotFoundMessage } from '@/components/common/AppStageMessage';

export const CompanyDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };
    const theme = useTheme();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { data: company, loading: isFetching, error, refresh } = useCompany(id);

    const { remove, loading: isDeleting } = useDeleteCompany(
        () => {
            setDeleteModalVisible(false);
            navigation.goBack();
        },
        (err) => Alert.alert('Błąd', err)
    );

    const handleEdit = () => {
        navigation.navigate('CompanyEdit', { company });
    };

    const handleDelete = async () => {
        await remove(id);
    };

    if (isFetching) {
        return <LoadingScreen text="Pobieranie danych firmy..." />;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: metrics.spacing.lg,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: metrics.spacing.xl,
        },
        title: {
            marginBottom: metrics.spacing.xs,
            flex: 1,
        },
        buttonRow: {
            flexDirection: 'row',
            gap: metrics.spacing.md,
        },
        button: {
            minWidth: 150,
        },
        deleteButton: {
            backgroundColor: theme.colors.error,
        },
        card: {
            flex: 1,
            marginVertical: 0,
            backgroundColor: theme.colors.background,
            padding: metrics.spacing.md,
        },
        cardTitle: {
            marginBottom: metrics.spacing.md,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: metrics.spacing.sm,
        },
        label: {
            fontWeight: '600',
            color: theme.colors.onSurfaceVariant,
            marginRight: metrics.spacing.md,
            width: 120,
        },
        value: {
            textAlign: 'left',
            flex: 1,
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

    if (error) {
        return <ErrorMessage error={error} onRetry={refresh} onBack={() => navigation.goBack()} />;
    }

    if (!company) {
        return (
            <NotFoundMessage title="Nie znaleziono klienta" onBack={() => navigation.goBack()} />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineMedium" style={styles.title}>
                    {company.name}
                </AppText>
                <View style={styles.buttonRow}>
                    <AppButton
                        icon={IconName.edit}
                        onPress={handleEdit}
                        style={styles.button}
                        mode="outlined"
                    >
                        Edytuj
                    </AppButton>
                    <AppButton
                        icon={IconName.delete}
                        onPress={() => setDeleteModalVisible(true)}
                        style={[styles.button, styles.deleteButton]}
                        mode="contained"
                    >
                        Usuń
                    </AppButton>
                </View>
            </View>

            <AppCard style={styles.card}>
                <AppText variant="titleLarge" style={styles.cardTitle}>
                    Informacje podstawowe
                </AppText>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        NIP:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {formatNip(company.taxId)}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Email:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {company.email || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Telefon:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {company.phoneNumber || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Adres:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {company.address.street} {company.address.houseNumber}
                        {'\n'}
                        {company.address.postalCode} {company.address.city}
                        {'\n'}
                        {company.address.country}
                    </AppText>
                </View>
            </AppCard>

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń firmę
                </AppText>
                <AppText variant="bodyLarge" style={styles.modalText}>
                    Czy na pewno chcesz usunąć firmę "{company.name}"? Ta operacja jest
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
                        disabled={isDeleting}
                    >
                        Usuń
                    </AppButton>
                </View>
            </AppModal>
        </ScrollView>
    );
};
