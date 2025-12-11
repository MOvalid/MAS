export type SortDirection = 'ASC' | 'DESC';

export interface PaginationFilter {
    page: number;
    limit: number;
}

export interface SearchFilter {
    search?: string;
}

export interface SortFilter {
    sortBy?: string;
    sortDirection?: SortDirection;
}
