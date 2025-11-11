export type ApiResponse<T> = {
    data: T;
    status: number;
    message?: string;
};

export type ApiError = {
    error: string;
    code?: number;
};
