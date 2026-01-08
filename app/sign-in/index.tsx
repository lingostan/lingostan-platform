import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseInput } from '@/components/ui/BaseInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BaseText } from '@/components/ui/BaseText';
import { useAuthControllerLogin } from '@/api/generated/lingoStanAPI';
import { saveTokens, saveUser, getSelectedLanguage } from '@/utils/authUtils';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginMutation = useAuthControllerLogin({
    mutation: {
      onSuccess: async (response) => {
        try {
          // Проверяем структуру ответа
          console.log('[Sign In] Response data:', JSON.stringify(response.data, null, 2));
          
          // API возвращает токены в формате snake_case (access_token, refresh_token)
          // Поддерживаем оба формата для совместимости
          const accessToken = response.data?.accessToken || response.data?.access_token;
          const refreshToken = response.data?.refreshToken || response.data?.refresh_token;
          
          // Проверяем наличие токенов в ответе
          if (!accessToken) {
            console.error('[Sign In] Access token missing in response:', response.data);
            Alert.alert('Ошибка', 'Токен доступа не получен от сервера');
            return;
          }
          if (!refreshToken) {
            console.error('[Sign In] Refresh token missing in response:', response.data);
            Alert.alert('Ошибка', 'Токен обновления не получен от сервера');
            return;
          }

          // Сохраняем токены
          await saveTokens(accessToken, refreshToken);
          // Сохраняем данные пользователя (если есть)
          if (response.data?.user) {
            await saveUser(response.data.user);
          }
          
          // Небольшая задержка для обеспечения сохранения токенов
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Проверяем наличие выбранного языка
          const languageId = await getSelectedLanguage();
          if (!languageId) {
            // Если язык не выбран, перенаправляем на страницу выбора языка
            router.push('/select-language');
          } else {
            // Если язык выбран, переходим на dashboard
            router.push('/(tabs)/dashboard');
          }
        } catch (error) {
          console.error('Ошибка при сохранении данных:', error);
          Alert.alert('Ошибка', 'Не удалось сохранить данные авторизации');
        }
      },
      onError: (error: any) => {
        console.error('Ошибка авторизации:', error);
        const errorMessage = error?.response?.data?.message || 'Неверный email или пароль';
        Alert.alert('Ошибка авторизации', errorMessage);
      },
    },
  });

  // Функция для входа
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    loginMutation.mutate({
      data: {
        email,
        password,
      },
    });
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" color="main" style={styles.title}>Авторизация</BaseText>
      <BaseInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <BaseInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <PrimaryButton 
        title={loginMutation.isPending ? "Вход..." : "Войти"} 
        onPress={handleLogin} 
        fluid
        disabled={loginMutation.isPending}
      />
      <PrimaryButton title="Нет аккаунта? Зарегистрируйтесь" mode="transparent" variant="blue" size="small" onPress={() => router.push('/sign-up')} fluid />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});
