import React, { createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
    signUp,
    confirmSignUp,
    resendSignUpCode,
    signIn,
    signOut,
    fetchAuthSession,
    getCurrentUser,
} from 'aws-amplify/auth';
import axios from 'axios';
import { amplifyConfiguration } from '@/configuration/amplify-configuration';
import { AuthProps, Credentials } from '@/types/auth';

Amplify.configure(amplifyConfiguration);

const EXPIRATION_BUFFER = 5 * 60 * 1000; // 5 min
const TIMEOUT_DURATION = 10000;          // 10s

// Axios instance
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: TIMEOUT_DURATION,
});

// Tokens cache
let cachedAccessToken: string | null = null;
let tokenExpiration: number = 0;

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleSignUp = async (credentials: Credentials) => {
        const { email, password } = credentials;
        try {
            return await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                    },
                },
            });
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    const handleResendSignUp = async (credentials: Credentials) => {
        const { email } = credentials;
        try {
            return await resendSignUpCode({ username: email });
        } catch (error) {
            console.error('Resend sign up error:', error);
            throw error;
        }
    };

    const handleConfirmSignUp = async (email: string, code: string) => {
        try {
            return await confirmSignUp({
                username: email,
                confirmationCode: code,
            });
        } catch (error) {
            console.error('Confirm sign up error:', error);
            throw error;
        }
    };

    const handleSignIn = async (credentials: Credentials) => {
        const { email, password } = credentials;
        try {
            const result = await signIn({
                username: email,
                password,
            });
            setIsAuthenticated(true);
            return result;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            cachedAccessToken = null;
            tokenExpiration = 0;
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        if (cachedAccessToken && Date.now() < tokenExpiration - EXPIRATION_BUFFER) {
            return cachedAccessToken;
        }
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();

            if (token && session.tokens?.accessToken) {
                cachedAccessToken = token;
                // Get expiration from the token payload
                const payload = session.tokens.accessToken.payload;
                if (payload.exp) {
                    tokenExpiration = payload.exp * 1000; // Convert to milliseconds
                }
                setIsAuthenticated(true);
                return token;
            }

            cachedAccessToken = null;
            setIsAuthenticated(false);
            return null;
        } catch (error) {
            console.error('Get access token error:', error);
            cachedAccessToken = null;
            setIsAuthenticated(false);
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                // Check if user is authenticated
                await getCurrentUser();
                const token = await getAccessToken();
                setIsAuthenticated(!!token);
            } catch (error) {
                console.error('Auth initialization error:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Interceptor axios
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                const token = await getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Cleanup interceptor on unmount
        return () => {
            api.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    const value: AuthProps = {
        isLoading,
        isAuthenticated,
        signUp: handleSignUp,
        resendSignUp: handleResendSignUp,
        confirmSignUp: handleConfirmSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        api,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
