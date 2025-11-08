import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
  const { setAccessToken } = useAuth();

  const login = async (email: string, password: string) => {
    const data = await loginAPI({ email, password });

    if (data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
    }

    await setAccessToken(data.accessToken);
  };

  return { login };
};
