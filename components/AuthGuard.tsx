// components/AuthGuard.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { checkAuth } from '../utils/authUtils';

export default function AuthGuard({ children }: any){
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true); // Состояние загрузки

  useEffect(() => {
    const verifyAuth = async () => {
      // Небольшая задержка для обеспечения сохранения токенов после авторизации
      await new Promise(resolve => setTimeout(resolve, 200));
      const isAuthenticated = await checkAuth(); // Проверяем JWT токен
      setIsLoading(false); // Завершаем загрузку
      if (!isAuthenticated) {
        router.replace('/sign-in'); // Перенаправляем на страницу авторизации
      }
    };

    verifyAuth();
  }, [router]);

  // Показываем спиннер, пока проверяется авторизация
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6CD96C" />
      </View>
    );
  }

  // Если авторизация успешна, отображаем дочерние компоненты
  return children;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
