import React, { useState, useEffect } from 'react';
import { AppCard, AppText, IconName } from '@/components/common';
import { AppTable } from '@/components/common/table/AppTable';
import { OrderItem, OrderItemDetails } from '@/types/domain/order-item';
import { TableColumn } from '../table';
import { calculateVat, formatPrice } from '@/utils/price-utils';
import { Currency } from '@/types/common';
import { metrics } from '@/theme/metrics';

type Props = {
    products: OrderItem[];
    onChange?: (updated: OrderItem[]) => void;
    onRemove?: (index: number) => void;
};

export const OrderProductList: React.FC<Props> = ({ products, onChange, onRemove }) => {
    const [items, setItems] = useState<OrderItem[]>(products);

    useEffect(() => {
        setItems(products);
    }, [products]);

    const getDetails = (item: OrderItem): OrderItemDetails => {
        const netPrice = item.quantity * item.unitPrice;
        const vatRate = 23;
        const vatAmount = calculateVat(netPrice, vatRate);
        const grossPrice = netPrice + vatAmount;

        return {
            ...item,
            netPrice,
            vatAmount,
            vatRate,
            grossPrice,
            currency: Currency.PLN,
        };
    };

    const styles = {
        noData: {
            textAlign: 'center',
            padding: metrics.spacing.md,
        },
    } as const;

    if (items.length === 0) {
        return (
            <AppCard>
                <AppText variant="bodyLarge" style={styles.noData}>
                    Brak pozycji w zamówieniu
                </AppText>
            </AppCard>
        );
    }

    const columns: TableColumn[] = [
        { key: 'product', title: 'Produkt', flex: 2, align: 'left' },
        { key: 'quantity', title: 'Ilość', flex: 1, align: 'center' },
        { key: 'unitPrice', title: 'Cena jedn.', flex: 1, align: 'center' },
        { key: 'netPrice', title: 'Netto', flex: 1, align: 'center' },
        { key: 'vatRate', title: 'VAT %', flex: 1, align: 'center' },
        { key: 'vatAmount', title: 'VAT', flex: 1, align: 'center' },
        { key: 'grossPrice', title: 'Brutto', flex: 1, align: 'center' },
        { key: 'currency', title: 'Waluta', flex: 1, align: 'center' },
    ];

    const tableData = items.map((item, index) => {
        const details = getDetails(item);
        return {
            product: details.productName,
            quantity: details.quantity,
            unitPrice: formatPrice(details.unitPrice),
            netPrice: formatPrice(details.netPrice),
            vatRate: details.vatRate,
            vatAmount: formatPrice(details.vatAmount),
            grossPrice: formatPrice(details.grossPrice),
            currency: details.currency,
            _index: index,
        };
    });

    const actions = (row: (typeof tableData)[0]) => [
        {
            icon: IconName.delete,
            onPress: () => onRemove?.(row._index),
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
