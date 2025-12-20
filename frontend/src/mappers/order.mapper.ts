// mappers/order.mapper.ts
import { OrderItemTableRow } from '@/types/domain';
import { OrderDto, OrderItemDto } from '@/types/dto';
import { OrderViewModel } from '@/types/view-model/order';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';

export const mapOrderListToViewModel = (list: OrderDto[]): OrderViewModel[] =>
    list.map((o, index) => ({
        lp: index + 1,
        id: o.id,
        createdAt: formatPolishDate(o.createdAt, true),
        customer: o.customer ?? '—',
        company: o.company ?? '—',
        status: o.status,
        seller: o.seller,
        invoiceNumber: o.invoiceNumber ?? '—',
    }));

export const mapOrderItemToTableRow = (item: OrderItemDto): OrderItemTableRow => ({
    product: item.product.name,
    quantity: item.quantity,
    unitPrice: formatPrice(item.unitPrice),
    netPrice: formatPrice(item.netPrice),
    unit: 'szt.',
    vat: formatPrice(item.vatAmount),
    vatRate: `${item.vatRate}%`,
    grossPrice: formatPrice(item.grossPrice),
    currency: item.currency,
});

export const mapOrderItemDtoListToTableRows = (
    orderItemDtos: OrderItemDto[]
): OrderItemTableRow[] => orderItemDtos.map(mapOrderItemToTableRow);
