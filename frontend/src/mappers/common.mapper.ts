/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Maps an array of DTOs to an array of domain models using a provided mapper function.
 *
 * @template TDto - Type of DTO
 * @template TDomain - Type of domain model
 *
 * @param dtos - Array of DTO objects
 * @param mapperFn - Function that maps a single DTO to a domain object
 * @returns Array of domain objects
 */
export const mapDtoListToDomain = <TDto, TDomain>(
    dtos: TDto[],
    mapperFn: (dto: TDto) => TDomain
): TDomain[] => dtos.map(mapperFn);

/**
 * Recursively maps a DTO object to a domain model by copying
 * only the properties that exist in the domain object.
 *
 * - Shallow fields are copied directly.
 * - Nested objects are mapped recursively.
 * - Extra properties in the DTO that do not exist in the domain are ignored.
 *
 * @template TDto - Type of the DTO object
 * @template TDomain - Type of the domain object
 *
 * @param dto - The DTO object to map
 * @param domainTemplate - Optional template object of TDomain to infer structure
 * @returns A new domain object with fields mapped from the DTO
 *
 * @example
 * const domainProduct = mapDtoToDomainRecursive(apiProduct, {} as Product);
 */
export const mapDtoToDomainRecursive = <TDto, TDomain>(
    dto: TDto,
    domainTemplate?: TDomain
): TDomain => {
    const domainObj = {} as TDomain;

    for (const key in dto) {
        // Only map if the key exists in the domain template or domainObj
        if (isDomainTemplateAnObject(key, domainTemplate)) {
            const dtoValue = (dto as any)[key];

            // If both are objects, map recursively
            if (checkObjectEquality(dto)) {
                (domainObj as any)[key] = mapDtoToDomainRecursive(
                    dtoValue,
                    domainTemplate ? (domainTemplate as any)[key] : undefined
                );
            } else {
                (domainObj as any)[key] = dtoValue;
            }
        }
    }

    return domainObj;
};

/**
 * Checks whether the domain template is an object and contains a specific key.
 * This is used to safely verify that a property exists on the domain model
 * before attempting to map a DTO field to it.
 *
 * @template TDto - Type of the DTO
 * @template TDomain - Type of the domain model
 * @param key - The key from the DTO to check in the domain template
 * @param domainTemplate - Optional template object of the domain model
 * @returns True if the domain template is an object and contains the key, or if no template is provided
 */
const isDomainTemplateAnObject = <TDto, TDomain>(
    key: Extract<keyof TDto, string>,
    domainTemplate?: TDomain
): boolean => {
    return (
        !domainTemplate ||
        (typeof domainTemplate === 'object' && domainTemplate !== null && key in domainTemplate)
    );
};

/**
 * Checks whether a value is a non-null object that is not an array.
 * Useful for determining if a DTO property should be recursively mapped
 * as a nested object in the domain model.
 *
 * @param dtoValue - The value from the DTO to check
 * @returns True if the value is a non-null object and not an array
 */
const checkObjectEquality = (dtoValue: any): boolean => {
    return dtoValue && typeof dtoValue === 'object' && !Array.isArray(dtoValue);
};

/**
 * Maps an array of DTOs to an array of domain models using recursive mapping.
 *
 * @template TDto - Type of DTO
 * @template TDomain - Type of domain model
 *
 * @param dtos - Array of DTO objects
 * @param domainTemplate - Optional template object of TDomain
 * @returns Array of domain objects with mapped properties
 *
 * @example
 * const products: Product[] = mapDtoListToDomainRecursive(apiProducts, {} as Product);
 */
export const mapDtoListToDomainRecursive = <TDto, TDomain>(
    dtos: TDto[],
    domainTemplate?: TDomain
): TDomain[] => dtos.map((dto) => mapDtoToDomainRecursive(dto, domainTemplate));

/* eslint-enable @typescript-eslint/no-explicit-any */
