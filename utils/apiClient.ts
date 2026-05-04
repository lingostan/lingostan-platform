import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isDevelopment, handleMockRequest } from './mockServer';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './authUtils';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Получаем базовый URL API из переменных окружения
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://gilaniel.ru';

// Создаем кастомный инстанс axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Флаг для предотвращения множественных одновременных refresh запросов
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Функция для форматирования JSON с отступами
const formatJSON = (obj: any): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
};

// Интерцептор для запросов
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Инициализируем headers, если их нет
    if (!config.headers) {
      config.headers = {} as any;
    }

    // Добавляем токен авторизации, если он есть
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Client] Access token added to request headers');
    } else {
      console.warn('[API Client] No access token found, request will be unauthenticated');
      console.warn('[API Client] Request URL:', config.url);
    }

    // Формируем полный URL
    const fullURL = config.url?.startsWith('http')
      ? config.url
      : `${config.baseURL || ''}${config.url || ''}`;

    // Логирование для отладки сетевых запросов (всегда включено)
    console.log('\n' + '='.repeat(80));
    console.log('🌐 [API REQUEST]');
    console.log('='.repeat(80));
    console.log(`Method:     ${config.method?.toUpperCase() || 'N/A'}`);
    console.log(`Full URL:   ${fullURL}`);
    console.log(`Base URL:   ${config.baseURL || 'N/A'}`);
    console.log(`Path:       ${config.url || 'N/A'}`);
    console.log('\nHeaders:');
    const headersToLog: Record<string, any> = { ...(config.headers || {}) };
    if (headersToLog.Authorization) {
      headersToLog.Authorization = '[REDACTED - Bearer Token]';
    }
    console.log(formatJSON(headersToLog));
    
    if (config.params) {
      console.log('\nQuery Params:');
      console.log(formatJSON(config.params));
    }
    
    if (config.data) {
      console.log('\nRequest Body:');
      console.log(formatJSON(config.data));
    }
    console.log('='.repeat(80) + '\n');

    return config;
  },
  (error) => {
    console.error('\n' + '='.repeat(80));
    console.error('❌ [API REQUEST ERROR]');
    console.error('='.repeat(80));
    console.error('Error:', error.message);
    if (error.config) {
      console.error('Config:', formatJSON({
        method: error.config.method,
        url: error.config.url,
        baseURL: error.config.baseURL,
        fullURL: `${error.config.baseURL || ''}${error.config.url || ''}`,
      }));
    }
    console.error('Stack:', error.stack);
    console.error('='.repeat(80) + '\n');
    return Promise.reject(error);
  }
);

// Интерцептор для ответов
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Формируем полный URL
    const fullURL = response.config.url?.startsWith('http')
      ? response.config.url
      : `${response.config.baseURL || ''}${response.config.url || ''}`;

    // Логирование для отладки сетевых ответов (всегда включено)
    console.log('\n' + '='.repeat(80));
    console.log('✅ [API RESPONSE]');
    console.log('='.repeat(80));
    console.log(`Method:       ${response.config.method?.toUpperCase() || 'N/A'}`);
    console.log(`Full URL:     ${fullURL}`);
    console.log(`Base URL:     ${response.config.baseURL || 'N/A'}`);
    console.log(`Path:         ${response.config.url || 'N/A'}`);
    console.log(`Status Code:  ${response.status} ${response.statusText || ''}`);
    console.log(`Status:       ${response.status >= 200 && response.status < 300 ? '✅ SUCCESS' : '⚠️  WARNING'}`);
    console.log('\nResponse Headers:');
    console.log(formatJSON(response.headers));
    console.log('\nResponse Data:');
    console.log(formatJSON(response.data));
    console.log('='.repeat(80) + '\n');

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на refresh или login/register
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh') &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/register')
    ) {
      if (isRefreshing) {
        // Если уже идет refresh, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Пытаемся обновить токен
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // API возвращает токены в формате snake_case (access_token, refresh_token)
        // Поддерживаем оба формата для совместимости
        const accessToken = response.data?.accessToken || response.data?.access_token;
        const newRefreshToken = response.data?.refreshToken || response.data?.refresh_token;
        
        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh response: missing tokens');
        }
        
        await saveTokens(accessToken, newRefreshToken);

        // Обновляем заголовок оригинального запроса
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        // Повторяем оригинальный запрос
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Если refresh не удался, очищаем токены и перенаправляем на логин
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // Обработка других ошибок с детальным логированием (всегда включено)
    const fullURL = error.config?.url?.startsWith('http')
      ? error.config.url
      : `${error.config?.baseURL || ''}${error.config?.url || ''}`;

    if (error.response) {
      // Сервер ответил с кодом ошибки
      console.error('\n' + '='.repeat(80));
      console.error('❌ [API ERROR RESPONSE]');
      console.error('='.repeat(80));
      console.error(`Method:       ${error.config?.method?.toUpperCase() || 'N/A'}`);
      console.error(`Full URL:     ${fullURL}`);
      console.error(`Base URL:     ${error.config?.baseURL || 'N/A'}`);
      console.error(`Path:         ${error.config?.url || 'N/A'}`);
      console.error(`Status Code:  ${error.response.status} ${error.response.statusText || ''}`);
      console.error(`Status:       ❌ ERROR`);
      console.error('\nResponse Headers:');
      console.error(formatJSON(error.response.headers));
      console.error('\nError Response Data:');
      console.error(formatJSON(error.response.data));
      console.error('='.repeat(80) + '\n');
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      console.error('\n' + '='.repeat(80));
      console.error('❌ [API NETWORK ERROR]');
      console.error('='.repeat(80));
      console.error(`Method:       ${error.config?.method?.toUpperCase() || 'N/A'}`);
      console.error(`Full URL:     ${fullURL}`);
      console.error(`Base URL:     ${error.config?.baseURL || 'N/A'}`);
      console.error(`Path:         ${error.config?.url || 'N/A'}`);
      console.error(`Error:        No response received from server`);
      console.error(`Message:      ${error.message || 'Network request failed'}`);
      if (error.request) {
        console.error('\nRequest Details:');
        console.error(formatJSON({
          readyState: error.request.readyState,
          status: error.request.status,
          statusText: error.request.statusText,
        }));
      }
      console.error('='.repeat(80) + '\n');
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('\n' + '='.repeat(80));
      console.error('❌ [API REQUEST SETUP ERROR]');
      console.error('='.repeat(80));
      console.error(`Error:        ${error.message || 'Unknown error'}`);
      if (error.config) {
        console.error(`Method:       ${error.config.method?.toUpperCase() || 'N/A'}`);
        console.error(`Full URL:     ${fullURL}`);
        console.error(`Base URL:     ${error.config.baseURL || 'N/A'}`);
        console.error(`Path:         ${error.config.url || 'N/A'}`);
      }
      if (error.stack) {
        console.error('\nStack Trace:');
        console.error(error.stack);
      }
      console.error('='.repeat(80) + '\n');
    }
    return Promise.reject(error);
  }
);

// Тип для конфигурации axios (используется в orval)
export type AxiosConfig = AxiosRequestConfig;

// Функция-обертка для orval mutator
// Orval передает тип как generic параметр, а config как аргумент
export const apiClient = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  // В режиме разработки используем моки
  if (isDevelopment) {
    // Формируем полный URL
    const fullURL = config.url?.startsWith('http')
      ? config.url
      : `${config.baseURL || API_BASE_URL}${config.url || ''}`;

    // Детальное логирование мокового запроса
    console.log('\n' + '='.repeat(80));
    console.log('🌐 [MOCK API REQUEST]');
    console.log('='.repeat(80));
    console.log(`Method:     ${config.method?.toUpperCase() || 'N/A'}`);
    console.log(`Full URL:   ${fullURL}`);
    console.log(`Base URL:   ${config.baseURL || API_BASE_URL}`);
    console.log(`Path:       ${config.url || 'N/A'}`);
    console.log('\nHeaders:');
    const headersToLog: Record<string, any> = { ...(config.headers || {}) };
    if (headersToLog.Authorization) {
      headersToLog.Authorization = '[REDACTED - Bearer Token]';
    }
    console.log(formatJSON(headersToLog));
    
    if (config.params) {
      console.log('\nQuery Params:');
      console.log(formatJSON(config.params));
    }
    
    if (config.data) {
      console.log('\nRequest Body:');
      console.log(formatJSON(config.data));
    }
    console.log('='.repeat(80) + '\n');

    // Возвращаем промис с моковым ответом
    return handleMockRequest(config)
      .then((response) => {
        // Детальное логирование мокового ответа
        console.log('\n' + '='.repeat(80));
        console.log('✅ [MOCK API RESPONSE]');
        console.log('='.repeat(80));
        console.log(`Method:       ${config.method?.toUpperCase() || 'N/A'}`);
        console.log(`Full URL:     ${fullURL}`);
        console.log(`Base URL:     ${config.baseURL || API_BASE_URL}`);
        console.log(`Path:         ${config.url || 'N/A'}`);
        console.log(`Status Code:  ${response.status} ${response.statusText || ''}`);
        console.log(`Status:       ${response.status >= 200 && response.status < 300 ? '✅ SUCCESS' : '⚠️  WARNING'}`);
        console.log('\nResponse Headers:');
        console.log(formatJSON(response.headers || {}));
        console.log('\nResponse Data:');
        console.log(formatJSON(response.data));
        console.log('='.repeat(80) + '\n');
        return response;
      })
      .catch((error) => {
        // Логирование ошибок мокового запроса
        console.error('\n' + '='.repeat(80));
        console.error('❌ [MOCK API ERROR]');
        console.error('='.repeat(80));
        console.error(`Method:       ${config.method?.toUpperCase() || 'N/A'}`);
        console.error(`Full URL:     ${fullURL}`);
        console.error(`Base URL:     ${config.baseURL || API_BASE_URL}`);
        console.error(`Path:         ${config.url || 'N/A'}`);
        console.error(`Error:        ${error.message || 'Unknown error'}`);
        if (error.response) {
          console.error(`Status Code:  ${error.response.status} ${error.response.statusText || ''}`);
          console.error('\nError Response Data:');
          console.error(formatJSON(error.response.data));
        }
        if (error.stack) {
          console.error('\nStack Trace:');
          console.error(error.stack);
        }
        console.error('='.repeat(80) + '\n');
        throw error;
      });
  }

  // В продакшене используем реальный API
  return axiosInstance.request(config) as Promise<AxiosResponse<T>>;
};

// Экспортируем инстанс для прямого использования, если нужно
export { axiosInstance };


