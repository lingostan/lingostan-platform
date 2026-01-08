// utils/authUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const SELECTED_LANGUAGE_KEY = 'selectedLanguage';
const SELECTED_LANGUAGE_DATA_KEY = 'selectedLanguageData';

// Функция для декодирования base64 в React Native
const decodeBase64 = (str: string): string => {
  try {
    // В React Native может не быть atob, используем альтернативный способ
    if (typeof atob !== 'undefined') {
      return atob(str);
    }
    // Полифилл для atob
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    for (let i = 0; i < str.length; i += 4) {
      const enc1 = chars.indexOf(str.charAt(i));
      const enc2 = chars.indexOf(str.charAt(i + 1));
      const enc3 = chars.indexOf(str.charAt(i + 2));
      const enc4 = chars.indexOf(str.charAt(i + 3));
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) output += String.fromCharCode(chr2);
      if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
  } catch (e) {
    throw new Error('Failed to decode base64');
  }
};

// Сохранение токенов
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    // Проверяем, что токены переданы
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log('[Auth Utils] Tokens saved successfully');
    console.log('[Auth Utils] Access token length:', accessToken.length);
    // Проверяем, что токен действительно сохранился
    const savedToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    if (savedToken === accessToken) {
      console.log('[Auth Utils] Token verification: OK');
    } else {
      console.error('[Auth Utils] Token verification: FAILED');
    }
  } catch (error) {
    console.error('Ошибка при сохранении токенов:', error);
    throw error;
  }
};

// Получение access токена
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      console.log('[Auth Utils] Access token retrieved, length:', token.length);
    } else {
      console.warn('[Auth Utils] No access token found in storage');
    }
    return token;
  } catch (error) {
    console.error('Ошибка при получении access токена:', error);
    return null;
  }
};

// Получение refresh токена
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Ошибка при получении refresh токена:', error);
    return null;
  }
};

// Удаление токенов
export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Ошибка при удалении токенов:', error);
    throw error;
  }
};

// Сохранение выбранного языка (ID)
export const saveSelectedLanguage = async (languageId: string) => {
  try {
    await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, languageId);
  } catch (error) {
    console.error('Ошибка при сохранении языка:', error);
    throw error;
  }
};

// Сохранение полной информации о выбранном языке
export const saveSelectedLanguageData = async (languageData: any) => {
  try {
    await AsyncStorage.setItem(SELECTED_LANGUAGE_DATA_KEY, JSON.stringify(languageData));
    // Также сохраняем ID для обратной совместимости
    await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, languageData.id.toString());
  } catch (error) {
    console.error('Ошибка при сохранении данных языка:', error);
    throw error;
  }
};

// Получение выбранного языка (ID)
export const getSelectedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SELECTED_LANGUAGE_KEY);
  } catch (error) {
    console.error('Ошибка при получении языка:', error);
    return null;
  }
};

// Получение полной информации о выбранном языке
export const getSelectedLanguageData = async (): Promise<any | null> => {
  try {
    const languageDataStr = await AsyncStorage.getItem(SELECTED_LANGUAGE_DATA_KEY);
    return languageDataStr ? JSON.parse(languageDataStr) : null;
  } catch (error) {
    console.error('Ошибка при получении данных языка:', error);
    return null;
  }
};

// Удаление выбранного языка
export const clearSelectedLanguage = async () => {
  try {
    await AsyncStorage.removeItem(SELECTED_LANGUAGE_KEY);
    await AsyncStorage.removeItem(SELECTED_LANGUAGE_DATA_KEY);
  } catch (error) {
    console.error('Ошибка при удалении языка:', error);
    throw error;
  }
};

// Проверка авторизации (проверяет наличие access токена)
export const checkAuth = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return false;
    }
    
    // Проверяем, не истек ли токен (базовая проверка)
    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        return false;
      }
      const payload = JSON.parse(decodeBase64(parts[1]));
      const exp = payload.exp * 1000; // Конвертируем в миллисекунды
      if (Date.now() >= exp) {
        // Токен истек
        return false;
      }
      return true;
    } catch (e) {
      // Если не удалось распарсить токен, считаем что авторизация недействительна
      return false;
    }
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    return false;
  }
};

// Сохранение данных пользователя
export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);
    throw error;
  }
};

// Получение данных пользователя
export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return null;
  }
};