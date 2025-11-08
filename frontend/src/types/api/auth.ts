export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export type LoginResponse = AuthTokens;

export interface ApiErrorResponse {
    message: string;
    [key: string]: unknown;
}

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};
