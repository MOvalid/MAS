import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { AppTable } from '../common/table/AppTable';
import { AppTextInput } from '../common/AppTextInput';
import { metrics } from '../../theme/metrics';
import { mapInvoiceSummaryDtoToTableRow } from '../../mappers/invoice.mapper';
import { InvoiceSummaryDto } from '../../types/dto/invoice';
import { AppDropdown } from '../common/AppDropdown';
import { AppDateRangeFilter } from '../common/AppDateRangeFilter';
import { IconName } from '../common';
import { InvoiceTableRow } from '../../types/domain';
import { InvoiceStatus } from '../../types/common';

const mockInvoices: InvoiceSummaryDto[] = [
    {
        id: '1', // UUID
        invoiceNumber: 'FV/2025/01',
        orderId: '101',
        customerFirstName: 'Jan',
        customerLastName: 'Kowalski',
        customerAddress: {
            street: 'Piękna',
            number: '10',
            city: 'Warszawa',
            postalCode: '00-001',
            country: 'Polska',
        },
        company: null,
        status: 'PAID',
        issuedAt: '2025-02-01T00:00:00Z',
        paymentDueDate: '2025-02-05T00:00:00Z',
        items: [],
        totalNet: 1000,
        totalVat: 200,
        totalGross: 1200,
        currency: 'PLN',
        payments: [],
    },
    {
        id: '2', // UUID
        invoiceNumber: 'FV/2025/02',
        orderId: '102',
        customerFirstName: 'ACME',
        customerLastName: '',
        customerAddress: {
            street: 'Nowa',
            number: '5',
            city: 'Kraków',
            postalCode: '31-000',
            country: 'Polska',
        },
        company: {
            id: 'c1', // UUID
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
        status: 'SENT',
        issuedAt: '2025-02-03T00:00:00Z',
        paymentDueDate: '2025-02-10T00:00:00Z',
        items: [],
        totalNet: 950,
        totalVat: 0,
        totalGross: 950,
        currency: 'PLN',
        payments: [],
    },
];

export const InvoiceScreen = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const tableData: InvoiceTableRow[] = useMemo(() => {
        return mockInvoices.map(mapInvoiceSummaryDtoToTableRow);
    }, [mockInvoices]);

    const editInvoice = (row: InvoiceTableRow) => {
        console.log(row);
        console.log('Edit invoice');
    };

    const downloadInvoice = (row: InvoiceTableRow) => {
        console.log(row);
        console.log('Download invoice');
    };

    const deleteInvoice = (row: InvoiceTableRow) => {
        console.log(row);
        console.log('Delete invoice');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge" style={styles.pageTitle}>
                    Faktury
                </AppText>
                <AppButton onPress={() => console.log('Nowa faktura')}>Nowa faktura</AppButton>
            </View>

            <View style={styles.filters}>
                <AppTextInput
                    placeholder="Wyszukaj"
                    value={search}
                    width={200}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />

                <AppDateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />

                <AppDropdown
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={[
                        { label: 'Wszystkie', value: InvoiceStatus.ALL },
                        { label: 'Opłacone', value: InvoiceStatus.PAID },
                        { label: 'Wysłane', value: InvoiceStatus.SENT },
                        { label: 'Przeterminowane', value: InvoiceStatus.OVERDUE },
                        { label: 'Anulowane', value: InvoiceStatus.CANCELLED },
                    ]}
                />
            </View>

            <AppTable
                columns={[
                    { key: 'lp', title: 'Lp.', align: 'center', flex: 0.2 },
                    {
                        key: 'issueDate',
                        title: 'Data wystawienia',
                        align: 'center',
                        flex: 1,
                    },
                    {
                        key: 'paymentDate',
                        title: 'Data opłacenia',
                        align: 'center',
                        flex: 1,
                    },
                    { key: 'number', title: 'Numer faktury', align: 'center', flex: 1 },
                    { key: 'amount', title: 'Kwota', align: 'center', flex: 1 },
                    { key: 'status', title: 'Status', align: 'center', flex: 1 },
                ]}
                data={tableData}
                actions={(row) => [
                    { icon: IconName.edit, onPress: () => editInvoice(row) },
                    { icon: IconName.download, onPress: () => downloadInvoice(row) },
                    {
                        icon: IconName.delete,
                        onPress: () => deleteInvoice(row),
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
    menuButton: {
        marginHorizontal: metrics.spacing.xs,
    },
    addButton: {
        marginLeft: 'auto',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pageTitle: {
        flexShrink: 1,
    },
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: metrics.spacing.lg,
    },
    filterItem: {
        flexBasis: '25%',
    },
});
