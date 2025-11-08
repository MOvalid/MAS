import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, removeTokens } from './authStorage';
import { refreshTokenAPI } from './authApi';
import { BASE_URL, TIMEOUT } from '../config';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getAccessToken();
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown>) => {
        const originalRequest = error.config as RetryableRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshTokenAPI();
                await setAccessToken(newToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                await removeTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
