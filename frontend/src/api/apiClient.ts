import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    removeTokens,
} from './authStorage';
import { refreshTokenAPI } from './authApi';
import { BASE_URL, TIMEOUT } from '../config';
import { normalizeApiError } from './errorNormalizer';

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401, refresh token, and normalize errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token available');

                const newTokens = await refreshTokenAPI(refreshToken);

                await setAccessToken(newTokens.accessToken);
                await setRefreshToken(newTokens.refreshToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                await removeTokens();
                return Promise.reject(normalizeApiError(refreshError as AxiosError));
            }
        }

        return Promise.reject(normalizeApiError(error));
    }
);
