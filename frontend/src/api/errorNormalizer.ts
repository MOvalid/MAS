import { AxiosError } from 'axios';
import { mapApiErrorDto } from '@/mappers/api-error.mapper';
import { ApiError, ApiErrorDto } from '@/types/common/error';

export const normalizeApiError = (error: AxiosError): ApiError => {
    const data = error.response?.data as ApiErrorDto | undefined;

    if (data) {
        return mapApiErrorDto(data);
    }

    return {
        message: error.message || 'Unknown error',
        code: error.response?.status,
        details: {},
    };
};
