import { AppText, AppCard, AppButton, IconName } from '@/components/common';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { metrics } from '@/theme/metrics';
import { Company } from '@/types/domain/company';
import { useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import { formatNip } from '@/utils/formatters';

const mockCompany: Company = {
    id: '123',
    name: 'Firma Przykładowa Sp. z o.o.',
    taxId: '1234567890',
    address: {
        street: 'Przykładowa',
        number: '1',
        city: 'Warszawa',
        postalCode: '00-001',
        country: 'Polska',
    },
    email: 'kontakt@firma.pl',
    phone: '+48 123 456 789',
};

export const CompanyDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const theme = useTheme();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const company = mockCompany;

    const handleEdit = () => {
        navigation.navigate('CompanyEdit', { id: company.id });
    };

    const handleDelete = () => {
        console.log('Usuwanie firmy:', company.id);
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
            fontSize: 16,
        },
        value: {
            textAlign: 'left',
            flex: 1,
            fontSize: 16,
        },
        noData: {
            color: theme.colors.onSurfaceVariant,
            fontStyle: 'italic',
            fontSize: 16,
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
                    {company.name}
                </AppText>
                <View style={styles.buttonRow}>
                    <AppButton icon={IconName.edit} onPress={handleEdit} style={styles.button}>
                        Edytuj firmę
                    </AppButton>
                    <AppButton
                        icon={IconName.delete}
                        onPress={() => setDeleteModalVisible(true)}
                        style={[styles.button, styles.deleteButton]}
                        mode="contained"
                    >
                        Usuń firmę
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
                        {company.phone || 'Brak'}
                    </AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText variant="bodyLarge" style={styles.label}>
                        Adres:
                    </AppText>
                    <AppText variant="bodyLarge" style={styles.value}>
                        {company.address.street}, {company.address.postalCode}{' '}
                        {company.address.city}, {company.address.country}
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
