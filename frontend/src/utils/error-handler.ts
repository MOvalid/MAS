/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiError, ApiErrorDto } from '@/types/common/error';
import { mapApiErrorDto } from '@/mappers/api-error.mapper';

/**
 * Universal JS error handler
 */
export const handleError = (err: unknown, contextMessage?: string): Error => {
    if (err instanceof Error) {
        console.error(contextMessage ?? 'Error occurred:', err.message);
        return err;
    } else {
        console.error(contextMessage ?? 'Unknown error occurred:', err);
        return new Error('Unknown error');
    }
};

/**
 * Universal API error handler
 */
export const handleApiError = (err: unknown, contextMessage?: string): ApiError => {
    // Axios-like error
    if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response;
        const dto: ApiErrorDto = response?.data ?? { message: 'Unknown error' };
        if (contextMessage) console.error(contextMessage, dto);
        return mapApiErrorDto(dto);
    }

    if (err instanceof Error) {
        if (contextMessage) console.error(contextMessage, err.message);
        return { message: err.message };
    }

    if (contextMessage) console.error(contextMessage, err);
    return { message: 'Unknown error' };
};
