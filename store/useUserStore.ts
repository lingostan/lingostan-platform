import { api } from '@/services/https';
import { Lang } from '@/types/lang/model';
import { User } from '@/types/user/model';
import { clearTokens, getRefreshToken, saveTokens } from '@/utils/secure';
import { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { create } from 'zustand';

interface Usertate {
  // Состояние
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  activeLang: Lang | null;

  // Методы (actions)
  signIn: (user: User) => void;
  signOut: () => void;
  checkAuth: () => Promise<User | null>;
  setActiveLang: (lang: Lang) => void;
}

export const useUserStore = create<Usertate>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  activeLang: null,

  signIn: (user) =>
    set({
      isAuthenticated: true,
      user,
      isLoading: false,
      activeLang: user.languages[0].language,
    }),

  signOut: () =>
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    }),

  setActiveLang: (lang) =>
    set({
      activeLang: lang,
    }),

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const { data } = await api.get<User>('/users/profile');
      set({
        isAuthenticated: true,
        user: data,
        isLoading: false,
      });
      return data;
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

          set({
            isAuthenticated: true,
            user: data,
            isLoading: false,
          });

          return data;
        } catch (refreshError) {
          console.error('Ошибка при обновлении токена:', refreshError);

          if (Platform.OS !== 'web') {
            clearTokens();
          }

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });

          return null;
        }
      }

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      return null;
    }
  },
}));
