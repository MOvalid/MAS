// src/api/authApi.ts
import { apiClient } from './apiClient';
import { LoginPayload, LoginResponse, RefreshTokenResponse } from '@/types/dto/auth';
import { handleApiError } from '@/utils/error-handler';

/**
 * Log in a user.
 * @param payload Login credentials
 * @returns LoginResponse with accessToken and refreshToken
 */
export const loginAPI = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/login', payload);
        return response.data;
    } catch (err: unknown) {
        throw handleApiError(err);
    }
};

/**
 * Refresh access and refresh tokens
 * @param refreshToken Current refresh token
 * @returns RefreshTokenResponse with new accessToken and refreshToken
 */
export const refreshTokenAPI = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    } catch (err: unknown) {
        throw handleApiError(err);
    }
};

/**
 * Log out the current user
 */
export const logoutAPI = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } catch (err: unknown) {
        throw handleApiError(err);
    }
};
