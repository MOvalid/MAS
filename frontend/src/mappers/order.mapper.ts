// mappers/order.mapper.ts
import {
    Order1,
    Order2,
    OrderItem,
    OrderItemTableData,
    OrderSummary,
    OrderTableData,
} from '@/types/domain';
import { OrderDto1, OrderDto2, OrderItemDto, OrderSummaryDto } from '@/types/dto';
import { mapPaymentDtoToDomain } from './payment.mapper';
import { mapCustomerDtoToDomain } from './customer.mapper';
import { mapSellerDtoToDomain } from './seller.mapper';
import { mapInvoiceDtoToDomain } from './invoice.mapper';
import { mapProductDtoToDomain } from './product.mapper';
import { Currency, ORDER_STATUS_LABELS, OrderStatus } from '@/types/common';
import { mapDeliveryDtoToDomain } from './delivery.mapper';
import { formatPolishDate } from '@/utils/formatters';
import { formatPrice } from '@/utils/price-utils';

export const mapOrderItemDtoToDomain = (dto: OrderItemDto): OrderItem => {
    const product = mapProductDtoToDomain(dto.product)
    console.log(product)
    return {
        productId: dto.productId,
        product: product,
        quantity: dto.quantity,
        unitNetPrice: dto.unitNetPrice,
        vatRate: dto.vatRate,
        currency: Currency.PLN,
        totalNetPrice: dto.totalNetPrice,
        totalVatAmount: dto.totalVatAmount,
        totalGrossPrice: dto.totalGrossPrice,
    };
};

export const mapOrder1ToTableData = (
    order: Order1,
    index: number,
    page: number = 1,
    limit: number = 10,
    customerMap: Record<string, string> = {},
    sellerMap: Record<string, string> = {}
): OrderTableData => {
    const rowNumber = (page - 1) * limit + index + 1;

    return {
        lp: rowNumber,
        id: order.id,
        createdAt: formatPolishDate(order.createdAt, false),
        customer: customerMap[order.customerId] || 'Nieznany',
        company: '',
        status: ORDER_STATUS_LABELS[order.status as OrderStatus],
        seller: sellerMap[order.sellerId] || 'Nieznany',
        invoiceNumber: '—',
    };
};

export const mapOrder2ToTableData = (
    order: Order2,
    index: number,
    page: number = 1,
    limit: number = 10
): OrderTableData => {
    const rowNumber = (page - 1) * limit + index + 1;

    return {
        lp: rowNumber,
        id: order.id,
        createdAt: formatPolishDate(order.createdAt, false),
        customer: order.customer,
        company: order.company,
        status: ORDER_STATUS_LABELS[order.status as OrderStatus],
        seller: order.seller,
        invoiceNumber: order.invoiceNUmber || 'Brak',
    };
};

export const mapOrderDto1ToDomain = (dto: OrderDto1): Order1 => {
    return {
        id: dto.id,
        createdAt: dto.createdAt,
        customerId: dto.customerId,
        sellerId: dto.sellerId,
        currency: dto.currency,
        status: dto.status,
        totalNetPrice: dto.totalNetPrice,
        totalGrossPrice: dto.totalGrossPrice,
        totalVatAmount: dto.totalVatAmount,
    };
};

export const mapOrderDto2ToDomain = (dto: OrderDto2): Order2 => {
    return {
        id: dto.id,
        createdAt: dto.createdAt,
        customer: dto.customer ?? '',
        company: dto.company ?? '',
        seller: dto.seller,
        status: dto.status,
        deliveryId: dto.deliveryId ?? '',
        invoiceNUmber: dto.invoiceNumber ?? '-',
    };
};

export const mapOrderSummaryDtoToDomain = (dto: OrderSummaryDto): OrderSummary => {
    const customer = mapCustomerDtoToDomain(dto.customer);
    console.log(customer);
    const seller = mapSellerDtoToDomain(dto.seller);
    console.log(seller);
    const delivery = dto.delivery ? mapDeliveryDtoToDomain(dto.delivery) : null;
    console.log(delivery);
    const invoice = dto.invoice ? mapInvoiceDtoToDomain(dto.invoice) : null;
    console.log(invoice);
    const payments = dto.payments ? dto.payments.map(mapPaymentDtoToDomain) : null;
    console.log(payments);
    const orderProducts = dto.orderProducts ? dto.orderProducts.map(mapOrderItemDtoToDomain) : [];
    console.log(orderProducts);
    return {
        id: dto.id,
        createdAt: dto.createdAt,
        // status: ORDER_STATUS_LABELS[dto.status as OrderStatus],
        status: dto.status as OrderStatus,
        currency: dto.currency,
        totalNetPrice: dto.totalNetPrice,
        totalVatAmount: dto.totalVatAmount,
        totalGrossPrice: dto.totalGrossPrice,
        customer: customer,
        seller: seller,
        delivery: delivery,
        invoice: invoice,
        orderProducts: orderProducts,
        payments: dto.payments ? dto.payments.map(mapPaymentDtoToDomain) : null,
    };
};

export const mapOrderItemToTableData = (item: OrderItem, index: number = 0): OrderItemTableData => {
    return {
        lp: (index + 1).toString(),
        _index: index,
        product: item.product.name,
        quantity: item.quantity,
        unit: 'szt.',
        unitPrice: formatPrice(item.unitNetPrice),
        netPrice: formatPrice(item.totalNetPrice),
        vatAmount: formatPrice(item.totalVatAmount),
        grossPrice: formatPrice(item.totalGrossPrice),
        vatRate: `${item.vatRate}%`,
        currency: item.currency,
    };
};
