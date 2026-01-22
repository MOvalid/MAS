export interface DailySummaryViewData {
    id: string;
    key:
        | 'totalOrders'
        | 'totalRevenue'
        | 'totalInvoices'
        | 'totalProductsSold'
        | 'totalInvoicesIssued'
        | 'averageOrderValue'
        | 'averageProductsPerOrder';
    title: string;
    value: string;
}

export interface DailySummaryDto {
    totalOrders: number;
    totalRevenue: number;
    totalInvoicesIssued: number;
    totalProductsSold: number;
    averageOrderValue: number;
    averageProductsPerOrder: number;
}


