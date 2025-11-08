import { API_BASE_URL, API_TIMEOUT } from '@env';

export const BASE_URL = API_BASE_URL;
export const TIMEOUT = Number(API_TIMEOUT);

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};
