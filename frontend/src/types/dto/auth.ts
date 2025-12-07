import { apiClient } from '@/api/apiClient';
import { User } from '../domain';

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ApiErrorResponse {
    message: string;
    [key: string]: unknown;
}

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export interface AuthContextType {
    user?: User;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    api: typeof apiClient;
}
