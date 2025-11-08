import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';

export const getAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setAccessToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const removeTokens = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};
