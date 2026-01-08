import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseInput } from '@/components/ui/BaseInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BaseText } from '@/components/ui/BaseText';
import { BasePicker } from '@/components/ui/BasePicker';
import { useAuthControllerRegister } from '@/api/generated/lingoStanAPI';
import { saveTokens, saveUser, getSelectedLanguage } from '@/utils/authUtils';

export default function SignUp() {
  const [name, setName] = useState(''); // Имя пользователя
  const [sex, setSex] = useState<'male' | 'female'>('male'); // Пол (по умолчанию "male")
  const [age, setAge] = useState(''); // Возраст
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Пароль
  const [phone, setPhone] = useState(''); // Телефон
  const [avatar, setAvatar] = useState(''); // Аватар
  const router = useRouter();

  const registerMutation = useAuthControllerRegister({
    mutation: {
      onSuccess: async (response) => {
        try {
          // Проверяем структуру ответа
          console.log('[Sign Up] Response data:', JSON.stringify(response.data, null, 2));
          
          // API возвращает токены в формате snake_case (access_token, refresh_token)
          // Поддерживаем оба формата для совместимости
          const accessToken = response.data?.accessToken || response.data?.access_token;
          const refreshToken = response.data?.refreshToken || response.data?.refresh_token;
          
          // Проверяем наличие токенов в ответе
          if (!accessToken) {
            console.error('[Sign Up] Access token missing in response:', response.data);
            Alert.alert('Ошибка', 'Токен доступа не получен от сервера');
            return;
          }
          if (!refreshToken) {
            console.error('[Sign Up] Refresh token missing in response:', response.data);
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
        console.error('Ошибка регистрации:', error);
        const errorMessage = error?.response?.data?.message || 'Не удалось зарегистрироваться. Проверьте введенные данные.';
        Alert.alert('Ошибка регистрации', errorMessage);
      },
    },
  });

  // Функция для регистрации
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните обязательные поля (имя, email, пароль)');
      return;
    }

    if (age) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 0) {
        Alert.alert('Ошибка', 'Введите корректный возраст');
        return;
      }
    }

    const requestData: any = {
      email,
      password,
      name,
      role: 'admin',
      sex,
    };

    // Добавляем необязательные поля только если они заполнены
    if (age) {
      requestData.age = age; // Отправляем как строку
    }
    if (phone) {
      requestData.phone = phone;
    }
    if (avatar) {
      requestData.avatar = avatar;
    }

    registerMutation.mutate({
      data: requestData,
    });
  };

  return (
    <View style={styles.container}>
      <BaseText variant='headingM' style={styles.title}>Регистрация</BaseText>

      {/* Поле ввода имени */}
      <BaseInput
        style={styles.input}
        placeholder="Имя"
        value={name}
        onChangeText={setName}
      />

      {/* Выбор пола */}
      <View style={styles.pickerContainer}>
        <BasePicker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue as 'male' | 'female')}
          items={[
            { label: 'Мужской', value: 'male' },
            { label: 'Женский', value: 'female'}
          ]}
          placeholder="Выберите пол"
          error=""
        />
      </View>

      {/* Поле ввода возраста */}
      <BaseInput
        style={styles.input}
        placeholder="Возраст (необязательно)"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Поле ввода телефона */}
      <BaseInput
        style={styles.input}
        placeholder="Телефон (необязательно)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Поле ввода аватара */}
      <BaseInput
        style={styles.input}
        placeholder="URL аватара (необязательно)"
        value={avatar}
        onChangeText={setAvatar}
        keyboardType="default"
      />

      {/* Поле ввода email */}
      <BaseInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Поле ввода пароля */}
      <BaseInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Кнопка регистрации */}
      <PrimaryButton 
        title={registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"} 
        onPress={handleRegister} 
        variant='green' 
        fluid={false}
        disabled={registerMutation.isPending}
      />

      {/* Ссылка на страницу авторизации */}
      <PrimaryButton size='small' title="Уже есть аккаунт? Войдите" mode='transparent' variant='blue' onPress={() => router.push('/sign-in')} />
    </View>
  );
};

// Стили
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
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});