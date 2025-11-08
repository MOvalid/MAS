import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getAccessToken, setAccessToken, removeTokens } from '../api/authStorage';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  removeTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const setAccessTokenFn = async (token: string) => {
    setAccessTokenState(token);
    await setAccessToken(token);
  };

  const getAccessTokenFn = async (): Promise<string | null> => {
    if (accessToken) return accessToken;
    const token = await getAccessToken();
    setAccessTokenState(token);
    return token;
  };

  const removeTokensFn = async () => {
    setAccessTokenState(null);
    await removeTokens();
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken: setAccessTokenFn, getAccessToken: getAccessTokenFn, removeTokens: removeTokensFn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
