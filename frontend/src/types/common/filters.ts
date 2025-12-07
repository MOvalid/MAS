import { PaginationFilter, SearchFilter, SortFilter } from './query-filters';

export type BaseQueryFilters = SearchFilter & PaginationFilter & SortFilter;

export type StockLevel = 'all' | 'none' | 'low' | 'medium' | 'high';
