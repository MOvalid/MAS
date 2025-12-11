/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiErrorDto {
    message: string;
    error?: string;
    statusCode?: number;
    timestamp?: string;
    path?: string;
    details?: Record<string, any>;
}

export interface ApiError {
    message: string;
    code?: number;
    details?: Record<string, any>;
}
