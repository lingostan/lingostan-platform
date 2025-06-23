import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import { BaseInput } from '@/components/ui/BaseInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BaseText } from '@/components/ui/BaseText';
import { BasePicker } from '@/components/ui/BasePicker';

export default function SignUp() {
  const [name, setName] = useState(''); // Имя пользователя
  const [gender, setGender] = useState('male'); // Пол (по умолчанию "Мужской")
  const [age, setAge] = useState(''); // Возраст
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Пароль
  const router = useRouter();

  // Функция для регистрации
  const handleRegister = async () => {
    try {
      if (!name || !gender || !age || !email || !password) {
        Alert.alert('Ошибка', 'Заполните все поля');
        return;
      }

      const newUser = {
        name,
        gender,
        age: parseInt(age, 10), // Преобразуем возраст в число
        email,
        password,
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser)); // Сохраняем данные в локальное хранилище
      Alert.alert('Успех', 'Вы успешно зарегистрировались!');
      router.replace('/sign-in'); // Переход на страницу авторизации
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Что-то пошло не так');
    }
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
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
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
        placeholder="Возраст"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
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
      <PrimaryButton title="Зарегистрироваться" onPress={handleRegister} variant='green' fluid={false} />

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