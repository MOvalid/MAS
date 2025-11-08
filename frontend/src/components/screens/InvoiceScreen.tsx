import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { AppTable } from '../common/table/AppTable';
import { AppTextInput } from '../common/AppTextInput';
import { metrics } from '../../theme/metrics';
import { mapApiInvoiceToDomain, mapInvoiceToTableRow } from '../../mappers/invoiceMapper';
import { ApiInvoice } from '../../types/api/invoice';
import { InvoiceTableRow } from '@/types/domain';
import { AppDropdown } from '../common/AppDropdown';
import { AppDateRangeFilter } from '../common/AppDateRangeFilter';
import { IconName } from '../common';
import { InvoiceStatus } from '@/types/common';

const mockApiInvoices: ApiInvoice[] = [
  {
    id: '1',
    title: 'Faktura VAT',
    number: 'FV/2025/01',
    issued_to_email: 'jan@kowalski.pl',
    issued_by_name: 'Anna Nowak',
    client_billing_data: { name: 'Jan Kowalski', nip: '1234567890', email: 'jan@kowalski.pl' },
    currency: 'PLN',
    issue_date: '2025-02-01',
    payment_due_date: '2025-02-05',
    payment_date: '2025-02-04',
    status: 'PAID',
    products: [],
    total_amount: 1200,
  },
  {
    id: '2',
    title: 'Faktura VAT',
    number: 'FV/2025/02',
    issued_to_email: 'kontakt@acme.pl',
    issued_by_name: 'Marek Duda',
    client_billing_data: { name: 'ACME Sp. z o.o.', nip: '9876543210' },
    currency: 'PLN',
    issue_date: '2025-02-03',
    payment_due_date: '2025-02-10',
    payment_date: null,
    status: 'SENT',
    products: [],
    total_amount: 950,
  },
];



export default function InvoiceScreen() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const domainInvoices = mockApiInvoices.map(mapApiInvoiceToDomain);
  const tableData = domainInvoices.map(mapInvoiceToTableRow);

  const editInvoice = (row: InvoiceTableRow) => {
    console.log('Edit invoice');
  };

  const downloadInvoice = (row: InvoiceTableRow) => {
    console.log('Download invoice');
  };

  const deleteInvoice = (row: InvoiceTableRow) => {
    console.log('Delete invoice');
  };


  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <AppText variant="headlineLarge" style={styles.pageTitle}>
          Faktury
        </AppText>
        <AppButton onPress={() => console.log('Nowa faktura')}>
          Nowa faktura
        </AppButton>
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
          { key: 'issueDate', title: 'Data wystawienia', align: 'center',flex: 1 },
          { key: 'paymentDate', title: 'Data opłacenia', align: 'center',flex: 1 },
          { key: 'number', title: 'Numer faktury', align: 'center', flex: 1 },
          { key: 'amount', title: 'Kwota', align: 'center', flex: 1 },
          { key: 'status', title: 'Status', align: 'center', flex: 1 },
        ]}
        data={tableData}
        actions={(row) => [
          { icon: IconName.edit, onPress: () => editInvoice(row) },
          { icon: IconName.download, onPress: () => downloadInvoice(row) },
          { icon: IconName.delete, onPress: () => deleteInvoice(row), iconColor: 'red' },
        ]}
      />
    </View>
  );
}

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
