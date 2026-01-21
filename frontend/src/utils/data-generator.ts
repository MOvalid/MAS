import {
    INVOICE_STATUS_VALUES,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_VALUES,
    OrderStatus,
    PAYMENT_METHOD_VALUES,
    PAYMENT_STATUS_VALUES,
    PaymentMethod,
    PaymentStatus,
} from '@/types/common';
import {
    AddressDto,
    CompanyDto,
    CustomerDto,
    StockProductDto,
    InvoiceSummaryDto,
    ProductDto,
    OrderDto,
    SellerDto,
    OrderItemDto,
    OrderSummaryDto,
    PaymentDto,
    StockProductResponseDto,
} from '@/types/dto';
import { calculateVat } from './price-utils';
import { DailySummaryDto } from '@/types/dto/dashboard';
import { StockLevel } from '@/types/common/filters';
import { StockLevelFilter, StockSortOption } from '@/types/domain/stock-filters';
import { FaqItem } from '@/components/screens/FaqScreen';

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

const productUnits = ['szt.'];

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

export const getMockStockProductsPaginated = (
    totalCount: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    stockLevel?: StockLevelFilter,
    sortBy?: StockSortOption
): StockProductResponseDto => {
    const allProducts = getMockStockProducts(totalCount);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
        data: allProducts.slice(startIndex, endIndex),
        total: totalCount,
        page,
        limit,
    };
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

const buildOrderItems = (orderId: string, products: ProductDto[]): OrderItemDto[] => {
    return products.slice(0, randomNumber(1, 3)).map((product) => {
        const quantity = randomNumber(1, 3);
        const netPrice = product.netPrice * quantity;
        const vatAmount = calculateVat(netPrice, product.vatRate);
        const grossPrice = netPrice + vatAmount;

        return {
            orderId,
            product,
            quantity,
            unitPrice: product.netPrice,
            netPrice,
            vatRate: product.vatRate,
            vatAmount,
            grossPrice,
            currency: product.currency,
        };
    });
};

const buildPayments = (orderId: string, totalGross: number): PaymentDto[] => [
    {
        id: randomId(),
        orderId,
        invoiceId: null,
        amount: totalGross,
        currency: 'PLN',
        paymentMethod: pick(PAYMENT_METHOD_VALUES) as PaymentMethod,
        status: pick(PAYMENT_STATUS_VALUES) as PaymentStatus,
        paymentDate: randomDate(),
    },
];

export const getMockOrderSummary = (): OrderSummaryDto => {
    const orderId = randomId();

    const products = getMockProducts(5);
    const orderItems = buildOrderItems(orderId, products);

    const totalGross = orderItems.reduce((sum, i) => sum + i.grossPrice, 0);

    return {
        id: orderId,
        createdAt: randomDate(),
        status: pick(ORDER_STATUS_VALUES) as OrderStatus,

        customer: buildCustomer(),
        company: Math.random() > 0.5 ? buildCompany() : null,

        seller: {
            id: randomId(),
            firstName: pick(firstNames),
            lastName: pick(lastNames),
            email: `seller.${Math.random().toString(36).slice(2)}@example.com`,
            orders: null,
        },

        delivery: {
            id: randomId(),
            orderId,
            deliveryDate: randomDate(),
            address: buildAddress(),
            trackingNumber: String(randomNumber(100000000, 999999999)),
            carrier: pick(['DHL', 'DPD', 'InPost']),
        },

        invoice: null,
        orderItems,
        payments: buildPayments(orderId, totalGross),
    };
};

export const getMockDailySummary = (): Promise<DailySummaryDto[]> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    key: 'dailyRevenue',
                    title: 'Przychody dzisiaj',
                    value: '12 345 PLN',
                },
                {
                    id: '2',
                    key: 'orders',
                    title: 'Zamówienia',
                    value: '58',
                },
                {
                    id: '3',
                    key: 'newCustomers',
                    title: 'Nowi klienci',
                    value: '7',
                },
                {
                    id: '4',
                    key: 'invoicesSent',
                    title: 'Wysłane faktury',
                    value: '21',
                },
                {
                    id: '5',
                    key: 'stockProducts',
                    title: 'Produkty w magazynie',
                    value: '156',
                },
                {
                    id: '6',
                    key: 'returns',
                    title: 'Zwroty',
                    value: '3',
                },
            ]);
        }, 6000);
    });

export const getFAQData = (): FaqItem[] => {
    return [
        {
            id: '1',
            question: 'Czym jest aplikacja Mobilny Asystent Sprzedawcy (MAS)?',
            answer:
                'MAS to aplikacja mobilna wspierająca pracę przedstawicieli handlowych. ' +
                'Umożliwia przeglądanie asortymentu, składanie zamówień oraz generowanie faktur ' +
                'bezpośrednio w trakcie spotkania z klientem.',
        },
        {
            id: '2',
            question: 'Jakie funkcje oferuje moduł zarządzania asortymentem?',
            answer:
                'Moduł umożliwia dodawanie, edytowanie oraz przeglądanie produktów. ' +
                'Każdy produkt posiada m.in. nazwę, kod SKU, cenę, kategorię oraz aktualny stan magazynowy. ' +
                'Dostępne jest także wyszukiwanie i filtrowanie produktów.',
        },
        {
            id: '3',
            question: 'Jak wygląda proces składania zamówienia?',
            answer:
                'Użytkownik wybiera klienta, dodaje produkty do koszyka oraz określa ich ilość. ' +
                'System automatycznie oblicza wartość zamówienia, które można następnie zatwierdzić.',
        },
        {
            id: '4',
            question: 'Czy aplikacja generuje faktury?',
            answer:
                'Tak. Po zatwierdzeniu zamówienia system automatycznie generuje fakturę w formacie PDF). ' +
                'Dokument można pobrać i zapisać w pamięci urządzenia.',
        },
        {
            id: '5',
            question: 'Czy muszę być zalogowany, aby korzystać z aplikacji?',
            answer:
                'Tak. Dostęp do systemu jest chroniony. Użytkownik musi zalogować się ' +
                'przy użyciu loginu i hasła, aby korzystać z funkcjonalności aplikacji.',
        },
        {
            id: '6',
            question: 'Jakie technologie zostały użyte w projekcie?',
            answer:
                'Frontend aplikacji został napisany w React, natomiast backend wykorzystuje ' +
                'ASP.NET Core Web API. Komunikacja odbywa się poprzez REST API, a dane przechowywane są w bazie SQL Server.',
        },
        {
            id: '7',
            question: 'Czy aplikacja działa na urządzeniach mobilnych?',
            answer:
                'Tak. Aplikacja została zaprojektowana z myślą rozwoju na urządzenia mobilnych. ' +
                'Aktualnie działa wersja aplikacji webowej, którą również można otworzyć w przeglądarce' +
                'na urządzeniu mobilnym. W przyszłości są planowane wersje natywnych aplikacji na systemy' +
                ' Android oraz iOS.',
        },
        {
            id: '8',
            question: 'Jak zabezpieczone są dane użytkowników?',
            answer:
                'Cała komunikacja odbywa się z wykorzystaniem HTTPS, a hasła użytkowników ' +
                'przechowywane są w bazie danych w postaci zaszyfrowanych hashy. ' +
                'Do autoryzacji wykorzystywane są tokeny JWT.',
        },
    ];
};
