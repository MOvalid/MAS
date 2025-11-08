import { apiClient } from './apiClient';
import { LoginPayload, LoginResponse } from '@/types/api/auth';

export const loginAPI = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const refreshTokenAPI = async (): Promise<string> => {
  const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
  return response.data.accessToken;
};
