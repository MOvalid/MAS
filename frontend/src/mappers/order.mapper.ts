// mappers/order.mapper.ts
import { OrderDto } from '@/types/dto';
import { OrderViewModel } from '@/types/view-model/order';
import { formatPolishDate } from '@/utils/formatters';


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
