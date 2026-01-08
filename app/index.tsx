import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { checkAuth } from '@/utils/authUtils';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDashboard = async () => {
      // Проверяем наличие токена для быстрого редиректа
      // Детальная проверка будет выполнена в UserProfileGuard
      const hasToken = await checkAuth();
      if (hasToken) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/sign-in');
      }
    };

    redirectToDashboard();
  }, [router]);

  return null;
}