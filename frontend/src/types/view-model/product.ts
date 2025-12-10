export interface StockProductViewModel {
    id: string;
    name: string;
    manufacturerName: string;
    stockQuantity: number;
    unit: string;
    netPrice: string;
    grossPrice: string;
    currency: string;
    lastRestocked: string;
}

export interface ProductViewModel {
    lp: number;
    id: string;
    name: string;
    manufacturer: string;
    sku: string;
    description: string;

    netPrice: string;
    grossPrice: string;
    vatAmount: string;
    vatRate: string;
    currency: string;

    categoryId: string | null;
    imageUrl: string | null;

    lastRestocked: string;
}
