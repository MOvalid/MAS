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
import { Currency } from '@/types/common';
import { mapDeliveryDtoToDomain } from './delivery.mapper';

export const mapOrderItemDtoToDomain = (dto: OrderItemDto): OrderItem => {
    return {
        productId: dto.productId,
        product: mapProductDtoToDomain(dto.product),
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
        createdAt: new Date(order.createdAt).toLocaleDateString('pl-PL'),
        customer: customerMap[order.customerId] || 'Nieznany',
        company: '',
        status: order.status,
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
        createdAt: order.createdAt.slice(0, 10),
        customer: order.customer,
        company: order.company,
        status: order.status,
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
        invoiceNUmber: dto.invoiceNumber ?? '—',
    };
};

export const mapOrderSummaryDtoToDomain = (dto: OrderSummaryDto): OrderSummary => {
    return {
        id: dto.id,
        createdAt: dto.createdAt,
        status: dto.status,
        currency: dto.currency,
        totalNetPrice: dto.totalNetPrice,
        totalVatAmount: dto.totalVatAmount,
        totalGrossPrice: dto.totalGrossPrice,
        customer: mapCustomerDtoToDomain(dto.customer),
        seller: mapSellerDtoToDomain(dto.seller),
        delivery: dto.delivery ? mapDeliveryDtoToDomain(dto.delivery) : null,
        invoice: dto.invoice ? mapInvoiceDtoToDomain(dto.invoice) : null,
        orderProducts: dto.orderProducts ? dto.orderProducts.map(mapOrderItemDtoToDomain) : null,
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
        unitPrice: item.unitNetPrice.toFixed(2),
        netPrice: item.totalNetPrice.toFixed(2),
        vatAmount: item.totalVatAmount.toFixed(2),
        grossPrice: item.totalGrossPrice.toFixed(2),
        vatRate: `${item.vatRate}%`,
        currency: item.currency,
    };
};
