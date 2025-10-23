// components/AuthGuard.js
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/useUserStore';

export default function AuthGuard({ children }: any) {
  const router = useRouter();
  const { isLoading, checkAuth, signIn } = useUserStore();

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth(); // Проверяем авторизацию
      if (!user?.email) {
        router.replace('/sign-in'); // Перенаправляем на страницу авторизации
        return;
      }

      signIn(user);
    };

    verifyAuth();
  }, [router]);

  // Показываем спиннер, пока проверяется авторизация
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Если авторизация успешна, отображаем дочерние компоненты
  return children;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
