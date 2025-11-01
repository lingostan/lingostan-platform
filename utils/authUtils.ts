import { AxiosError } from 'axios';
import { Platform } from 'react-native';

import { api } from '@/services/https';
import { User } from '@/types/user/model';

import { clearTokens, getRefreshToken, saveTokens } from './secure';

export const checkAuth = async () => {
  try {
    const { data } = await api.get<User>('/users/profile');

    return !!data.email;
  } catch (error) {
    const e = error as AxiosError;
    if (e.response?.status === 401) {
      let refreshToken: string | null = '';

      try {
        if (Platform.OS !== 'web') {
          refreshToken = await getRefreshToken();

          if (!refreshToken) throw new Error('No refresh token');
        } else {
          refreshToken = window.localStorage.getItem('refresh_token');
        }

        const refreshRes = await api.post('/auth/refresh', { refreshToken });
        const { access_token, refresh_token } = refreshRes.data;

        if (Platform.OS !== 'web') {
          saveTokens(access_token, refresh_token);
        } else {
          window.localStorage.setItem('access_token', access_token);
          window.localStorage.setItem('refresh_token', refresh_token);
        }

        const { data } = await api.get<User>('/users/profile');

        return !!data.email;
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError);

        if (Platform.OS !== 'web') {
          clearTokens();
        }
        return false;
      }
    }

    console.error('Ошибка при проверке авторизации:', error);
    return false;
  }
};
