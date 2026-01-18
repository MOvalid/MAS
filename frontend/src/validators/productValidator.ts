export type ProductValidationErrors = Record<string, string>;

export interface ProductInput {
    name: string;
    sku: string;
    categoryId: string;
    netPrice: string;
    vatRate: string;
    stockQuantity: string;
    manufacturerId: string;
    // countryOfOrigin: string;
    // weight?: string;
    length?: string;
    width?: string;
    height?: string;
    // warranty?: string;
    // ean?: string;
    description: string;
}

export const validateProduct = (input: ProductInput): ProductValidationErrors => {
    const errors: ProductValidationErrors = {};

    if (!input.name.trim()) errors.name = 'Nazwa produktu jest wymagana';
    if (!input.sku.trim()) errors.sku = 'SKU jest wymagane';
    if (!input.categoryId) errors.categoryId = 'Wybierz kategorię';
    if (!input.description.trim()) errors.description = 'Opis produktu jest wymagany';
    if (!input.manufacturerId.trim()) errors.manufacturer = 'Producent jest wymagany';
    // if (!input.countryOfOrigin.trim()) errors.countryOfOrigin = 'Kraj pochodzenia jest wymagany';

    if (!input.netPrice || isNaN(Number(input.netPrice)) || Number(input.netPrice) < 0)
        errors.netPrice = 'Wprowadź poprawną cenę netto';
    if (!input.vatRate || isNaN(Number(input.vatRate)) || Number(input.vatRate) < 0)
        errors.vatRate = 'Wprowadź poprawną stawkę VAT';
    if (
        !input.stockQuantity ||
        isNaN(Number(input.stockQuantity)) ||
        Number(input.stockQuantity) < 0
    )
        errors.stockQuantity = 'Stan magazynowy nie może być ujemny';
    // if (input.weight && (isNaN(Number(input.weight)) || Number(input.weight) < 0))
    // errors.weight = 'Wprowadź poprawną wagę';
    if (input.length && (isNaN(Number(input.length)) || Number(input.length) < 0))
        errors.length = 'Wprowadź poprawną długość';
    if (input.width && (isNaN(Number(input.width)) || Number(input.width) < 0))
        errors.width = 'Wprowadź poprawną szerokość';
    if (input.height && (isNaN(Number(input.height)) || Number(input.height) < 0))
        errors.height = 'Wprowadź poprawną wysokość';
    // if (input.warranty && (isNaN(Number(input.warranty)) || Number(input.warranty) < 0))
    //     errors.warranty = 'Wprowadź poprawną wartość gwarancji';

    // if (input.ean && !/^\d{13}$/.test(input.ean)) errors.ean = 'EAN musi mieć 13 cyfr';

    return errors;
};
