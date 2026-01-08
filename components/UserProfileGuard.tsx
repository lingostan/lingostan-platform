import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useUsersControllerGetProfile } from '@/api/generated/lingoStanAPI';
import { checkAuth, clearTokens } from '@/utils/authUtils';

interface UserProfileGuardProps {
  children: React.ReactNode;
}

// Сегменты путей, на которых не нужно проверять профиль
const PUBLIC_SEGMENTS = ['sign-in', 'sign-up', 'select-language'];

export default function UserProfileGuard({ children }: UserProfileGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingToken, setIsCheckingToken] = React.useState(true);

  // Проверяем, является ли текущая страница публичной
  const isPublicPage = segments.some(segment => PUBLIC_SEGMENTS.includes(segment));

  // Проверяем токен перед выполнением запроса
  useEffect(() => {
    const verifyToken = async () => {
      if (isPublicPage) {
        setIsCheckingToken(false);
        return;
      }

      try {
        const hasValidToken = await checkAuth();
        if (!hasValidToken) {
          await clearTokens();
          router.replace('/sign-in');
          return;
        }
        setIsCheckingToken(false);
      } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        await clearTokens();
        router.replace('/sign-in');
      }
    };

    verifyToken();
  }, [isPublicPage, router]);

  // Выполняем запрос профиля на всех страницах (кроме публичных)
  const { data: profileResponse, isLoading, error } = useUsersControllerGetProfile({
    query: {
      enabled: !isPublicPage && !isCheckingToken, // Выполняем только если не публичная страница и токен проверен
      retry: false, // Не повторяем запрос при ошибке
    },
  });

  // Обрабатываем результат запроса профиля
  useEffect(() => {
    if (isPublicPage || isCheckingToken) {
      return;
    }

    const handleProfileResponse = async () => {
      if (isLoading) {
        return; // Ждем загрузки
      }

      // Обрабатываем ошибку 401
      if (error) {
        const status = (error as any)?.response?.status;
        if (status === 401 || status === 403) {
          await clearTokens();
          router.replace('/sign-in');
          return;
        }
        // Для других ошибок тоже перенаправляем на вход
        await clearTokens();
        router.replace('/sign-in');
        return;
      }

      // Проверка выбранного языка отключена
      // if (profileResponse?.data) {
      //   const user = profileResponse.data;
      //   const languages = user.languages || [];
      //   
      //   // Проверяем, не находимся ли мы уже на странице выбора языка
      //   const isOnSelectLanguagePage = segments.includes('select-language');
      //   
      //   if (languages.length === 0 && !isOnSelectLanguagePage) {
      //     // Если у пользователя нет языков, перенаправляем на выбор языка
      //     router.replace('/select-language');
      //     return;
      //   }
      // }
    };

    handleProfileResponse();
  }, [profileResponse, isLoading, error, isPublicPage, isCheckingToken, router, segments]);

  // Показываем загрузку во время проверки токена или загрузки профиля
  if (!isPublicPage && (isCheckingToken || isLoading)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6CD96C" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

