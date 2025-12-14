import { INVOICE_STATUS_VALUES, ORDER_STATUS_LABELS, ORDER_STATUS_VALUES } from '@/types/common';
import {
    AddressDto,
    CompanyDto,
    CustomerDto,
    StockProductDto,
    InvoiceSummaryDto,
    ProductDto,
    OrderDto,
    SellerDto,
} from '@/types/dto';

const randomId = () => crypto.randomUUID();
const randomDate = () => new Date(Date.now() - Math.random() * 1e10).toISOString();

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ['Jan', 'Anna', 'Kamil', 'Julia', 'Robert', 'Kinga'];
const lastNames = ['Kowalski', 'Nowak', 'Zieliński', 'Mazur', 'Wójcik', 'Kaczmarek'];

const streetNames = ['Leśna', 'Słoneczna', 'Krótka', 'Wspólna', 'Polna', 'Kwiatowa'];
const cities = ['Warszawa', 'Kraków', 'Poznań', 'Gdańsk', 'Wrocław', 'Łódź'];

const companyNames = [
    'TechNova',
    'SoftVision',
    'ACME Sp. z o.o.',
    'GlobalTech',
    'PolSteel',
    'FreshFood',
];

const productNames = [
    'Wkrętarka',
    'Młotek',
    'Zestaw śrub',
    'Piła tarczowa',
    'Klucz francuski',
    'Wiertło 8mm',
    'Pędzel malarski',
    'Taśma izolacyjna',
];

const productUnits = ['szt.', 'opak.', 'kg', 'm', 'l'];

const buildAddress = (): AddressDto => ({
    street: pick(streetNames),
    number: String(randomNumber(1, 150)),
    city: pick(cities),
    postalCode: `${randomNumber(10, 99)}-${randomNumber(100, 999)}`,
    country: 'Polska',
});

const buildCompany = (): CompanyDto => ({
    id: randomId(),
    name: pick(companyNames),
    taxId: `PL${randomNumber(1000000000, 9999999999)}`,
    address: buildAddress(),
    email: Math.random() > 0.5 ? `kontakt@${Math.random().toString(16).slice(2)}.pl` : null,
    phone: Math.random() > 0.5 ? `+48${randomNumber(100000000, 999999999)}` : null,
});

const buildCustomer = (): CustomerDto => ({
    id: randomId(),
    firstName: pick(firstNames),
    lastName: pick(lastNames),
    email: `${Math.random().toString(36).slice(2)}@example.com`,
    phoneNumber: Math.random() > 0.5 ? `+48${randomNumber(100000000, 999999999)}` : null,
    address: Math.random() > 0.2 ? buildAddress() : null,
    orders: null,
});

export const getMockStockProducts = (count: number): StockProductDto[] => {
    return Array.from({ length: count }).map(() => {
        const name = pick(productNames);
        const netPrice = parseFloat((Math.random() * 800 + 50).toFixed(2));
        const grossPrice = parseFloat((netPrice * 1.23).toFixed(2));

        return {
            id: randomId(),
            name,
            manufacturer: buildCompany(),
            stockQuantity: randomNumber(0, 200),
            unit: pick(productUnits),
            netPrice,
            grossPrice,
            currency: 'PLN',
            lastRestockedAt: randomDate(),
        };
    });
};
export const getMockInvoices = (count: number): InvoiceSummaryDto[] => {
    const statuses = INVOICE_STATUS_VALUES;

    return Array.from({ length: count }).map((_, i) => {
        const issued = randomDate();
        const due = randomDate();

        const net = randomNumber(300, 8000);
        const vat = Math.floor(net * 0.23);
        const gross = net + vat;

        return {
            id: randomId(),
            invoiceNumber: `FV/${2025}/${String(i + 1).padStart(3, '0')}`,
            orderId: randomId(),
            customer: buildCustomer(),
            company: Math.random() > 0.3 ? buildCompany() : null,
            status: pick(statuses),
            issuedAt: issued,
            paymentDueDate: due,
            items: [],
            totalNet: net,
            totalVat: vat,
            totalGross: gross,
            currency: 'PLN',
            payments: [],
        };
    });
};

export const mockCategories = [
    { id: 'cat1', name: 'Elektronarzędzia' },
    { id: 'cat2', name: 'Narzędzia ręczne' },
    { id: 'cat3', name: 'Materiały budowlane' },
    { id: 'cat4', name: 'Artykuły malarskie' },
];

export const getMockProducts = (count: number): ProductDto[] => {
    return Array.from({ length: count }).map(() => {
        const name = pick(productNames);
        const netPrice = parseFloat((Math.random() * 500 + 20).toFixed(2));
        const grossPrice = parseFloat((netPrice * 1.23).toFixed(2));
        const vatAmount = parseFloat((grossPrice - netPrice).toFixed(2));

        const category = Math.random() > 0.2 ? pick(mockCategories) : null;

        return {
            id: randomId(),
            name,
            manufacturer: pick(companyNames),
            sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            stockQuantity: randomNumber(0, 50),
            description:
                Math.random() > 0.3 ? `${name} — wysokiej jakości produkt przemysłowy.` : null,
            categoryId: category?.id ?? null,

            netPrice,
            vatRate: 23,
            grossPrice,
            vatAmount,
            currency: 'PLN',

            imageUrl:
                Math.random() > 0.6
                    ? `https://picsum.photos/seed/${Math.random().toString(16).slice(2)}/300`
                    : null,

            lastRestockedAt: Math.random() > 0.3 ? randomDate() : null,
        };
    });
};

const sellers = ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski'];

export const getMockOrders = (count: number): OrderDto[] =>
    Array.from({ length: count }).map(() => ({
        id: randomId(),
        createdAt: randomDate(),
        customer: Math.random() > 0.4 ? pick(firstNames) + ' ' + pick(lastNames) : null,
        company: Math.random() > 0.5 ? pick(companyNames) : null,
        status: ORDER_STATUS_LABELS[pick(ORDER_STATUS_VALUES)],
        seller: pick(sellers),
        deliveryId: Math.random() > 0.6 ? randomId() : null,
        invoiceNumber: Math.random() > 0.7 ? `FV/${randomNumber(1, 999)}/2025` : null,
    }));

export const getMockSellers = (count: number = 10, orders?: OrderDto[]): SellerDto[] => {
    return Array.from({ length: count }).map(() => {
        const firstName = pick(firstNames);
        const lastName = pick(lastNames);

        const sellerOrders = orders ? orders.filter(() => Math.random() > 0.7) : null;

        return {
            id: randomId(),
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            orders: sellerOrders?.length ? sellerOrders : null,
        };
    });
};
