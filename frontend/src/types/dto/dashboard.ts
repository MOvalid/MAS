export interface DailySummaryDto {
    id: string;
    key: 'dailyRevenue' | 'orders' | 'newCustomers' | 'invoicesSent' | 'stockProducts' | 'returns';
    title: string;
    value: string;
}
