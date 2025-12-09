import { StockProductDto } from '@/types/dto';

export const getMockStockProducts = (count: number): StockProductDto[] => {
    const randomAddress = (i: number) => ({
        street: `Ulica ${i + 1}`,
        number: `${Math.ceil(Math.random() * 100)}`,
        city: `Miasto ${Math.ceil(Math.random() * 20)}`,
        postalCode: `${10000 + Math.floor(Math.random() * 90000)}`,
        country: 'Polska',
    });

    const randomCompany = (i: number) => ({
        id: `company-${i + 1}`,
        name: `Producent ${i + 1}`,
        taxId: `PL${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        address: randomAddress(i),
        email: Math.random() > 0.5 ? `kontakt${i + 1}@firma.pl` : null,
        phone:
            Math.random() > 0.5 ? `+48${Math.floor(100000000 + Math.random() * 900000000)}` : null,
    });

    const products: StockProductDto[] = Array.from({ length: count }).map((_, i) => {
        const randomDate = new Date(Date.now() - Math.random() * 1e10);
        const lastRestockedAt = randomDate.toISOString();

        const netPrice = parseFloat((Math.random() * 800 + 50).toFixed(2)); // 50 - 850
        const grossPrice = parseFloat((netPrice * 1.23).toFixed(2)); // VAT 23%

        return {
            id: `${i + 1}`,
            name: `Produkt ${i + 1}`,
            manufacturer: randomCompany(i),
            stockQuantity: Math.floor(Math.random() * 200),
            unit: 'szt.',
            netPrice,
            grossPrice,
            currency: 'PLN',
            lastRestockedAt,
        };
    });

    return products;
};
