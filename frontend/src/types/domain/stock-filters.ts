import { BaseQueryFilters } from '../common/filters';

export enum StockLevelFilter {
    All = 'all',
    None = 'none',
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export enum StockSortOption {
    NameAscending = 'NAME_ASC',
    NameDescending = 'NAME_DESC',
    ManufacturerAscending = 'MANUFACTURER_ASC',
    ManufacturerDescending = 'MANUFACTURER_DESC',
    StockAscending = 'STOCK_ASC',
    StockDescending = 'STOCK_DESC',
}

export interface StockFilters extends BaseQueryFilters {
    stockLevel?: StockLevelFilter;
    sortBy?: StockSortOption;
}
