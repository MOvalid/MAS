import { BaseQueryFilters } from '../common/filters';

export enum StockLevelFilter {
    All = 'all',
    None = 'none',
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export enum StockSortOption {
    NameAscending = 'name_asc',
    NameDescending = 'name_desc',
    StockAscending = 'stock_asc',
    StockDescending = 'stock_desc',
}

export interface StockFilters extends BaseQueryFilters {
    stockLevel?: StockLevelFilter;
    sortBy?: StockSortOption;
}
