// utils/authUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage'

// Функция для проверки авторизации
export const checkAuth = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user')
    return !!storedUser // Возвращает true, если пользователь авторизован
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error)
    return false
  }
}
