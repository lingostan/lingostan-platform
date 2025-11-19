import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Создаем кастомный инстанс axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.lingostan.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для запросов
axiosInstance.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации, логирование и т.д.
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для ответов
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Здесь можно обработать ошибки глобально
    if (error.response) {
      // Сервер ответил с кодом ошибки
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      console.error('Network Error:', error.request);
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Тип для конфигурации axios (используется в orval)
export type AxiosConfig = AxiosRequestConfig;

// Функция-обертка для orval mutator
export const apiClient = (config: AxiosRequestConfig) => {
  return axiosInstance.request(config);
};

// Экспортируем инстанс для прямого использования, если нужно
export { axiosInstance };


