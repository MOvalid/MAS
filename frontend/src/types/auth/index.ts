/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

export enum FieldType {
    EMAIL = 'email',
    PASSWORD = 'password',
}

export interface Credentials {
    email: string;
    password: string;
}

export interface AuthProps {
    isLoading?: boolean;
    isAuthenticated?: boolean;
    userEmail?: string | null;
    signUp?: (credentials: Credentials) => Promise<any>;
    resendSignUp?: (credentials: Credentials) => Promise<any>;
    confirmSignUp?: (email: string, code: string) => Promise<any>;
    signIn?: (credentials: Credentials) => Promise<any>;
    signOut?: () => Promise<any>;
    updatePassword?: (oldPassword: string, newPassword: string) => Promise<void>;
    api?: AxiosInstance | null;
}

export interface AuthErrors {
    email: string;
    password: string;
}
