// src/mappers/invoice.mapper.ts

import { InvoiceDto, InvoiceDetailsDto } from '@/types/dto';
import { Invoice, InvoiceDetails, InvoiceTableData } from '@/types/domain';
import { mapOrderDto2ToDomain } from './order.mapper';
import { mapCompanyDtoToDomain } from './company.mapper';
import { INVOICE_STATUS_LABELS, InvoiceStatus } from '@/types/common';

export const mapInvoiceDtoToDomain = (dto: InvoiceDto): Invoice => {
    return {
        id: dto.id,
        invoiceNumber: dto.invoiceNumber,
        orderId: dto.orderId,
        companyId: dto.companyId,
        issuedAt: dto.issuedAt,
        status: dto.status,
        paymentDueDate: dto.paymentDueDate,
    };
};

export const mapInvoiceDetailsDtoToDomain = (dto: InvoiceDetailsDto): InvoiceDetails => {
    return {
        id: dto.id,
        invoiceNumber: dto.invoiceNumber,
        status: dto.status,
        issuedAt: dto.issuedAt,
        paymentDueDate: dto.paymentDueDate,
        order: mapOrderDto2ToDomain(dto.order),
        company: mapCompanyDtoToDomain(dto.company),
    };
};


export const mapInvoiceToTableData = (
    domain: Invoice, 
    index: number, 
    page: number = 1, 
    limit: number = 10
): InvoiceTableData => {
    const lp = (page - 1) * limit + index + 1;

    return {
        lp: lp.toString(),
        invoiceNumber: domain.invoiceNumber,
        orderId: domain.orderId,
        issuedAt: domain.issuedAt,
        paymentDueDate: domain.paymentDueDate,
        status: INVOICE_STATUS_LABELS[domain.status as InvoiceStatus],
        totalGrossPrice: 0, 
        currency: 'PLN',
    };
};
