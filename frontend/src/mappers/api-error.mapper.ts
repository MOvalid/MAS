import { ApiErrorDto, ApiError } from '@/types/common/error';

export const mapApiErrorDto = (dto: ApiErrorDto): ApiError => ({
    message: dto.message || dto.error || 'Unknown error',
    code: dto.statusCode,
    details: dto.details || {
        timestamp: dto.timestamp,
        path: dto.path,
    },
});
