import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../common/AppButton';
import { AppText } from '../common/AppText';
import { AppTable } from '../common/table/AppTable';
import { AppDropdown } from '../common/AppDropdown';
import { AppDateFilter } from '../common/AppDateFilter';
import { AppTextInput } from '../common/AppTextInput';
import { metrics } from '../../theme/metrics';
import { InvoiceStatus } from '../../types/common/enums';
import { mapApiInvoiceToDomain, mapInvoiceToTableRow } from '../../mappers/invoiceMapper';
import { ApiInvoice } from '../../types/api/invoice';
import { Menu } from 'react-native-paper';
import { useAppTheme } from '@/theme/AppThemeContext';

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
  const { colors, metrics } = useAppTheme();
  const [search, setSearch] = useState('');
  const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const domainInvoices = mockApiInvoices.map(mapApiInvoiceToDomain);
  const tableData = domainInvoices.map(mapInvoiceToTableRow);

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

        <Menu
          visible={periodMenuVisible}
          onDismiss={() => setPeriodMenuVisible(false)}
          anchor={
            <AppButton
              mode="outlined"
              onPress={() => setPeriodMenuVisible(true)}
              style={styles.menuButton}
            >
              Okres: Wszystkie 2025
            </AppButton>
          }
        >
          <Menu.Item onPress={() => {}} title="2025" />
          <Menu.Item onPress={() => {}} title="2024" />
        </Menu>

        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <AppButton
              mode="outlined"
              onPress={() => setStatusMenuVisible(true)}
              style={styles.menuButton}
            >
              Status: Wszystkie
            </AppButton>
          }
        >
          <Menu.Item onPress={() => {}} title="Opłacone" />
          <Menu.Item onPress={() => {}} title="Nieopłacone" />
        </Menu>
      </View>

      {/* 🔹 Tabela */}
      <AppTable
        columns={[
          { key: 'lp', title: 'Lp.' },
          { key: 'issueDate', title: 'Data wystawienia' },
          { key: 'paymentDate', title: 'Data opłacenia' },
          { key: 'number', title: 'Numer faktury' },
          { key: 'amount', title: 'Kwota' },
          { key: 'status', title: 'Status' },
        ]}
        data={tableData}
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
    gap: metrics.spacing.sm,
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
    // marginBottom: metrics.spacing.md,
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
