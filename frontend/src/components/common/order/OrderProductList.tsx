import React from 'react';
import { AppCard, AppText, IconName } from '@/components/common';
import { AppTable } from '@/components/common/table/AppTable';
import { OrderItem, OrderItemTableData } from '@/types/domain/order-item';
import { TableColumn } from '../table';
import { metrics } from '@/theme/metrics';
import { mapOrderItemToTableData } from '@/mappers/order.mapper';

type Props = {
    products: OrderItem[];
    onChange?: (updated: OrderItem[]) => void;
    onRemove?: (index: number) => void;
};

export const OrderProductList: React.FC<Props> = ({ products, onChange, onRemove }) => {
    const styles = {
        noData: {
            textAlign: 'center',
            padding: metrics.spacing.md,
        },
    } as const;

    if (products.length === 0) {
        return (
            <AppCard>
                <AppText variant="bodyLarge" style={styles.noData}>
                    Brak pozycji w zamówieniu
                </AppText>
            </AppCard>
        );
    }

    const columns: TableColumn<OrderItemTableData>[] = [
        { key: 'product', title: 'Produkt', flex: 2, align: 'left' },
        { key: 'quantity', title: 'Ilość', flex: 1, align: 'center' },
        { key: 'unitPrice', title: 'Cena jedn.', flex: 1, align: 'center' },
        { key: 'netPrice', title: 'Netto', flex: 1, align: 'center' },
        { key: 'vatRate', title: 'VAT %', flex: 1, align: 'center' },
        { key: 'vatAmount', title: 'VAT', flex: 1, align: 'center' },
        { key: 'grossPrice', title: 'Brutto', flex: 1, align: 'center' },
        { key: 'currency', title: 'Waluta', flex: 1, align: 'center' },
    ];

    const tableData = products.map((item, index) => mapOrderItemToTableData(item, index));

    const actions = (row: (typeof tableData)[0]) => [
        {
            icon: IconName.delete,
            onPress: () => {
                onRemove?.(row._index);
            },
        },
    ];

    return (
        <AppCard>
            <AppTable
                title="Lista produktów"
                columns={columns}
                data={tableData}
                actions={actions}
            />
        </AppCard>
    );
};
