// src/types/common/sorting.ts
export type SortOrder = 'asc' | 'desc';

export interface SortOption<T extends string = string> {
    field: T; // np. 'name', 'stock', 'price'
    order: SortOrder; // 'asc' | 'desc'
}
