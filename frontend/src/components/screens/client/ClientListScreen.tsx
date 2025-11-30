import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../common/AppButton';
import { AppText } from '../../common/AppText';
import { AppTable } from '../../common/table/AppTable';
import { AppTextInput } from '../../common/AppTextInput';
import { metrics } from '../../../theme/metrics';
import { mapCompanyDtoToTableRow } from '../../../mappers/company.mapper';
import { CompanyDto } from '../../../types/dto/company';
import { IconName } from '../../common';
import { CompanyTableRow } from '../../../types/domain';

const mockCompanies: CompanyDto[] = [
    {
        id: '1',
        name: 'ACME Sp. z o.o.',
        taxId: '9876543210',
        address: {
            street: 'Nowa',
            number: '5',
            city: 'Kraków',
            postalCode: '31-000',
            country: 'Polska',
        },
        email: 'kontakt@acme.pl',
        phone: '123456789',
    },
    {
        id: '2',
        name: 'Tech Solutions S.A.',
        taxId: '1234567890',
        address: {
            street: 'Warszawska',
            number: '15',
            city: 'Warszawa',
            postalCode: '00-001',
            country: 'Polska',
        },
        email: 'biuro@techsolutions.pl',
        phone: '987654321',
    },
    {
        id: '3',
        name: 'BuildCorp Sp. z o.o.',
        taxId: '5555555555',
        address: {
            street: 'Budowlana',
            number: '22',
            city: 'Wrocław',
            postalCode: '50-001',
            country: 'Polska',
        },
        email: null,
        phone: null,
    },
];

export const ClientListScreen = () => {
    const [search, setSearch] = useState('');

    const tableData: CompanyTableRow[] = useMemo(() => {
        return mockCompanies.map(mapCompanyDtoToTableRow);
    }, [mockCompanies]);

    const editCompany = (row: CompanyTableRow) => {
        console.log(row);
        console.log('Edit company');
    };

    const deleteCompany = (row: CompanyTableRow) => {
        console.log(row);
        console.log('Delete company');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge" style={styles.pageTitle}>
                    Firmy
                </AppText>
                <AppButton onPress={() => console.log('Nowa firma')}>Nowa firma</AppButton>
            </View>

            <View style={styles.filters}>
                <AppTextInput
                    placeholder="Wyszukaj"
                    value={search}
                    width={200}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            <AppTable
                columns={[
                    { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
                    { key: 'name', title: 'Nazwa', align: 'left', flex: 1.5 },
                    { key: 'taxId', title: 'NIP', align: 'left', flex: 1 },
                    { key: 'email', title: 'Email', align: 'left', flex: 1.2 },
                    { key: 'phone', title: 'Telefon', align: 'left', flex: 1 },
                ]}
                data={tableData}
                actions={(row) => [
                    { icon: IconName.edit, onPress: () => editCompany(row) },
                    {
                        icon: IconName.delete,
                        onPress: () => deleteCompany(row),
                        iconColor: 'red',
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: metrics.spacing.lg,
    },
    searchInput: {
        flex: 1,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: metrics.spacing.xl,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pageTitle: {
        flexShrink: 1,
    },
});
