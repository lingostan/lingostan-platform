import axios from 'axios';
import { Platform } from 'react-native';

import { getAccessToken } from '@/utils/secure';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const publicPaths = ['/auth/register', '/auth/login', '/auth/refresh'];

  const isPublic = publicPaths.some((path) => config.url?.startsWith(path));

  if (!isPublic) {
    let token = '';

    if (Platform.OS === 'web') {
      token = window.localStorage.getItem('access_token') || '';
    } else {
      const at = await getAccessToken();

      token = at || '';
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
