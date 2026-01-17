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
    fetchUserAttributes,
    updatePassword,
} from 'aws-amplify/auth';
import axios from 'axios';
import { amplifyConfiguration } from '@/configuration/amplify-configuration';
import { AuthProps, Credentials } from '@/types/auth';

Amplify.configure(amplifyConfiguration);

const EXPIRATION_BUFFER = 5 * 60 * 1000; // 5 min
const TIMEOUT_DURATION = 10000; // 10s

// Axios instance
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: TIMEOUT_DURATION,
});

// Tokens cache
let cachedIdToken: string | null = null;
let tokenExpiration: number = 0;

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

// Helper function to get access token (shared)
const getIdToken = async (setIsAuthenticated: (val: boolean) => void): Promise<string | null> => {
    // Return cached token if still valid
    if (cachedIdToken && Date.now() < tokenExpiration - EXPIRATION_BUFFER) {
        return cachedIdToken;
    }

    try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const token = session.tokens?.idToken?.toString();

        if (token && session.tokens?.idToken) {
            cachedIdToken = token;
            // Get expiration from the token payload
            const payload = session.tokens.idToken.payload;
            if (payload.exp) {
                tokenExpiration = payload.exp * 1000; // Convert to milliseconds
            }
            setIsAuthenticated(true);
            return token;
        }

        cachedIdToken = null;
        setIsAuthenticated(false);
        return null;
    } catch (error) {
        console.error('Get id token error:', error);
        cachedIdToken = null;
        setIsAuthenticated(false);
        return null;
    }
};

// Helper function to get user email
const getUserEmail = async (): Promise<string | null> => {
    try {
        const attributes = await fetchUserAttributes();
        return attributes.email || null;
    } catch (error) {
        console.error('Get user email error:', error);
        return null;
    }
};

// Setup axios interceptor ONCE at module level
let interceptorSetup = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Setup interceptor only once
    useEffect(() => {
        if (!interceptorSetup) {
            interceptorSetup = true;

            api.interceptors.request.use(
                async (config) => {
                    const token = await getIdToken(setIsAuthenticated);
                    console.log('🔑 Request interceptor:', {
                        url: config.url,
                        hasToken: !!token,
                        tokenPreview: token?.substring(0, 30) + '...',
                    });
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            // Response interceptor to handle 401 errors
            api.interceptors.response.use(
                (response) => {
                    console.log('Response:', response.status, response.config.url);
                    return response;
                },
                async (error) => {
                    console.error('Response error:', {
                        status: error.response?.status,
                        url: error.config?.url,
                        message: error.message,
                        data: error.response?.data,
                    });

                    if (error.response?.status === 401) {
                        console.log('401 Unauthorized - signing out');

                        try {
                            setIsLoading(true);
                            await signOut();
                        } catch (e) {
                            console.error('Error during forced sign out:', e);
                        } finally {
                            cachedIdToken = null;
                            tokenExpiration = 0;
                            setIsAuthenticated(false);
                            setUserEmail(null);
                            setIsLoading(false);
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }
    }, []);

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
            // First, check if there's already a signed-in user
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    console.log('⚠️ User already signed in, signing out first...');
                    await signOut();
                    cachedIdToken = null;
                    tokenExpiration = 0;
                }
            } catch (e) {
                // No user signed in, proceed with sign in
            }

            const result = await signIn({
                username: email,
                password,
            });

            // Force refresh token after sign in
            await getIdToken(setIsAuthenticated);

            // Get user email
            const userEmailResult = await getUserEmail();
            setUserEmail(userEmailResult);
            setIsAuthenticated(true);
            return result;
        } catch (error) {
            console.error('Sign in error:', error);

            // If error is "There is already a signed in user", sign out and retry
            if (error instanceof Error && error.message.includes('already a signed in user')) {
                console.log('🔄 Signing out existing user and retrying...');
                try {
                    await signOut();
                    cachedIdToken = null;
                    tokenExpiration = 0;

                    // Retry sign in
                    const result = await signIn({
                        username: email,
                        password,
                    });
                    await getIdToken(setIsAuthenticated);

                    const userEmailResult = await getUserEmail();
                    setUserEmail(userEmailResult);

                    setIsAuthenticated(true);
                    return result;
                } catch (retryError) {
                    console.error('Retry sign in failed:', retryError);
                    throw retryError;
                }
            }

            throw error;
        }
    };

    const handleSignOut = async () => {
        setIsLoading(true);

        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        } finally {
            cachedIdToken = null;
            tokenExpiration = 0;
            setIsAuthenticated(false);
            setUserEmail(null);
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (oldPassword: string, newPassword: string) => {
        try {
            await updatePassword({
                oldPassword,
                newPassword,
            });
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                // Check if user is authenticated
                const currentUser = await getCurrentUser();
                console.log('Current user found:', currentUser.username);

                const token = await getIdToken(setIsAuthenticated);
                if (token) {
                    console.log('Token retrieved successfully');
                    setIsAuthenticated(true);

                    // Get user email
                    const email = await getUserEmail();
                    setUserEmail(email);
                    console.log('📧 User email:', email);
                } else {
                    console.log('⚠️ No valid token, user needs to sign in');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log('No authenticated user found');
                setIsAuthenticated(false);
                setUserEmail(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const value: AuthProps = {
        isLoading,
        isAuthenticated,
        userEmail,
        signUp: handleSignUp,
        resendSignUp: handleResendSignUp,
        confirmSignUp: handleConfirmSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        updatePassword: handleUpdatePassword,
        api,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
