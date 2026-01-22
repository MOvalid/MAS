import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import { LoadingScreen } from '../LoadingScreen';
import { useCustomer, useDeleteCustomer } from '@/composables/customer/useCustomers';
import { ErrorMessage, NotFoundMessage } from '@/components/common/AppStageMessage';

export const CustomerDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };
    const theme = useTheme();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { data: customer, loading: isFetching, error, refresh } = useCustomer(id);

    const { remove, loading: isDeleting } = useDeleteCustomer(
        () => {
            setDeleteModalVisible(false);
            navigation.goBack();
        },
        (err) => {
            setDeleteModalVisible(false);
            Alert.alert('Błąd', err);
        }
    );

    const handleEdit = () => {
        navigation.navigate('CustomerEdit', { customer });
    };

    const handleDelete = async () => {
        await remove(id);
    };

    if (isFetching) {
        return <LoadingScreen text="Pobieranie danych klienta..." />;
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
            minWidth: 160,
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
            fontWeight: metrics.fontWeight.semibold,
            color: theme.colors.onSurfaceVariant,
            marginRight: metrics.spacing.md,
            width: 180,
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

    if (!customer) {
        return (
            <NotFoundMessage title="Nie znaleziono klienta" onBack={() => navigation.goBack()} />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineMedium" style={styles.title}>
                    {customer.firstName} {customer.lastName}
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
                    Dane klienta
                </AppText>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Email:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {customer.email || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Telefon:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {customer.phoneNumber || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Adres:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {customer.address.street} {customer.address.houseNumber}
                        {'\n'}
                        {customer.address.postalCode} {customer.address.city}
                        {'\n'}
                        {customer.address.country}
                    </AppText>
                </View>
            </AppCard>

            <AppModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <AppText variant="titleLarge" style={styles.modalTitle}>
                    Usuń klienta
                </AppText>
                <AppText variant="bodyLarge" style={styles.modalText}>
                    Czy na pewno chcesz usunąć klienta "{customer.firstName} {customer.lastName}"?
                    Ta operacja jest nieodwracalna.
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
