import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';

const mockCustomer = {
    id: '987',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 500 600 700',
    address: {
        street: 'Lipowa',
        number: '22A',
        city: 'Kraków',
        postalCode: '30-001',
        country: 'Polska',
    },
};

export const CustomerDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const customer = mockCustomer;

    const handleEdit = () => {
        navigation.navigate('ClientEdit', { id: customer.id });
    };

    const handleDelete = () => {
        console.log('Usuwanie klienta:', customer.id);
        setDeleteModalVisible(false);
        navigation.goBack();
    };

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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineMedium" style={styles.title}>
                    {customer.firstName} {customer.lastName}
                </AppText>
                <View style={styles.buttonRow}>
                    <AppButton icon={IconName.edit} onPress={handleEdit} style={styles.button}>
                        Edytuj klienta
                    </AppButton>
                    <AppButton
                        icon={IconName.delete}
                        onPress={() => setDeleteModalVisible(true)}
                        style={[styles.button, styles.deleteButton]}
                        mode="contained"
                    >
                        Usuń klienta
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
                        {customer.phone || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Adres:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {customer.address.street} {customer.address.number},{' '}
                        {customer.address.postalCode} {customer.address.city},{' '}
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
