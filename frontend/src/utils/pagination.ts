// utils/pagination.ts
export interface PaginatedResult<T> {
    items: T[];
    total: number;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export async function paginate<T>(
    repository: any, // np. TypeORM repository
    options: PaginationOptions,
    searchFields: (keyof T)[] = []
): Promise<PaginatedResult<T>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    let query = repository.createQueryBuilder('entity');

    // filtracja po search (dla string fields)
    if (options.search && searchFields.length > 0) {
        searchFields.forEach((field, i) => {
            const param = `%${options.search}%`;
            if (i === 0) query = query.where(`entity.${String(field)} LIKE :param`, { param });
            else query = query.orWhere(`entity.${String(field)} LIKE :param`, { param });
        });
    }

    // sortowanie
    if (options.sortBy) {
        query = query.orderBy(`entity.${options.sortBy}`, options.sortOrder ?? 'ASC');
    }

    const [items, total] = await query.skip(skip).take(limit).getManyAndCount();
    return { items, total };
}
