
import { DailySummaryDto, DailySummaryViewData } from '@/types/dto/dashboard';
import { formatPrice } from '@/utils/price-utils';

export const mapDailySummaryDtoToViewData = (dto: DailySummaryDto): DailySummaryViewData[] => {
    const config: { key: DailySummaryViewData['key']; title: string }[] = [
        { key: 'totalOrders', title: 'Liczba zamówień' },
        { key: 'totalRevenue', title: 'Całkowity przychód' },
        { key: 'totalInvoicesIssued', title: 'Wystawione faktury' },
        { key: 'totalProductsSold', title: 'Sprzedane produkty' },
        { key: 'averageOrderValue', title: 'Średnia wartość zamówienia' },
        { key: 'averageProductsPerOrder', title: 'Średnia liczba produktów na 1 zamówienie' },
    ];

    return config.map((item) => {
        let formattedValue: string;

        switch (item.key) {
            case 'totalRevenue':
            case 'averageOrderValue':
                formattedValue = `${formatPrice(dto[item.key])} PLN`;
                break;
            case 'averageProductsPerOrder':
                formattedValue = dto[item.key].toFixed(2).replace('.', ',');
                break;
            default:
                formattedValue = dto[item.key as keyof DailySummaryDto]?.toString() || '0';
        }

        return {
            id: item.key,
            key: item.key,
            title: item.title,
            value: formattedValue,
        };
    });
};
