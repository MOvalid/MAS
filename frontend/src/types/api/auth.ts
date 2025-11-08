import { AxiosError } from "axios";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {}

export interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}
