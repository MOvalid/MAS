import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { getMockInvoices } from '@/utils/data-generator';
import { AppText, AppButton, IconName } from '@/components/common';
import { AppPaginationControls } from '@/components/common/AppPaginationControls';
import { AppTable } from '@/components/common/table';
import { mapInvoiceSummaryDtoToTableRow } from '@/mappers/invoice.mapper';
import { metrics } from '@/theme/metrics';
import { InvoiceStatus } from '@/types/common';
import { InvoiceTableRow } from '@/types/domain';
import { InvoiceSummaryDto } from '@/types/dto';
import { InvoiceListFilters } from './InvoiceListFilters';

const mockInvoices: InvoiceSummaryDto[] = getMockInvoices(50);

export const InvoiceListScreen = () => {
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.ALL);
    const [sortBy, setSortBy] = useState('ISSUED_DESC');
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        if (!startDate || !endDate) {
            setDateError('');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            setDateError('Data końcowa nie może być wcześniejsza niż początkowa.');
        } else {
            setDateError('');
        }
    }, [startDate, endDate]);

    useEffect(() => {
        setPage(1);
    }, [search, status, startDate, endDate, sortBy]);

    const { items, total } = useMemo(() => {
        let filtered = [...mockInvoices];

        // Szukanie
        if (search.trim()) {
            filtered = filtered.filter(
                (i) =>
                    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                    i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    i.customer.lastName.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status !== InvoiceStatus.ALL) {
            filtered = filtered.filter((i) => i.status === status);
        }
        if (startDate) {
            const start = new Date(`${startDate}T00:00:00`);
            filtered = filtered.filter((i) => new Date(i.issuedAt) >= start);
        }

        if (endDate) {
            const end = new Date(`${endDate}T23:59:59`);
            filtered = filtered.filter((i) => new Date(i.issuedAt) <= end);
        }

        // Sortowanie
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'ISSUED_ASC':
                    return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
                case 'ISSUED_DESC':
                    return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
                case 'PAYMENT_ASC':
                    return (
                        new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime()
                    );
                case 'PAYMENT_DESC':
                    return (
                        new Date(b.paymentDueDate).getTime() - new Date(a.paymentDueDate).getTime()
                    );
                case 'AMOUNT_ASC':
                    return a.totalGross - b.totalGross;
                case 'AMOUNT_DESC':
                    return b.totalGross - a.totalGross;
                default:
                    return 0;
            }
        });

        const total = filtered.length;
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return { items: paginated.map(mapInvoiceSummaryDtoToTableRow), total };
    }, [search, status, startDate, endDate, sortBy, page]);

    const onPrevious = () => setPage((p) => Math.max(1, p - 1));
    const onNext = () => setPage((p) => Math.min(Math.ceil(total / limit), p + 1));

    const editInvoice = (row: InvoiceTableRow) => console.log('Edit', row);
    const downloadInvoice = (row: InvoiceTableRow) => console.log('Download', row);
    const deleteInvoice = (row: InvoiceTableRow) => console.log('Delete', row);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="headlineLarge">Faktury</AppText>
                <AppButton onPress={() => console.log('Nowa faktura')}>Nowa faktura</AppButton>
            </View>

            <InvoiceListFilters
                search={search}
                onSearchChange={setSearch}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                status={status}
                onStatusChange={setStatus}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                dateError={dateError}
            />
            <AppTable
                columns={[
                    { key: 'lp', title: 'Lp.', align: 'left', flex: 0.2 },
                    { key: 'issueDate', title: 'Data wystawienia', align: 'center', flex: 1 },
                    { key: 'paymentDate', title: 'Data opłacenia', align: 'center', flex: 1 },
                    { key: 'invoiceNumber', title: 'Numer faktury', align: 'center', flex: 1 },
                    { key: 'amount', title: 'Kwota', align: 'center', flex: 1 },
                    { key: 'currency', title: 'Waluta', align: 'center', flex: 1 },
                    { key: 'status', title: 'Status', align: 'center', flex: 1 },
                ]}
                data={items}
                actions={(row) => [
                    { icon: IconName.download, onPress: () => downloadInvoice(row) },
                    { icon: IconName.delete, onPress: () => deleteInvoice(row), iconColor: 'red' },
                ]}
            />

            <View style={styles.paginationRow}>
                <AppPaginationControls
                    page={page}
                    totalPages={Math.max(1, Math.ceil(total / limit))}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, gap: metrics.spacing.lg },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    paginationRow: { marginTop: metrics.spacing.md, width: '100%', alignItems: 'center' },
});
