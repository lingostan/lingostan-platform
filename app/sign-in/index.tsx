import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'

import { BaseInput } from '@/components/ui/BaseInput'
import { BaseText } from '@/components/ui/BaseText'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  // Функция для входа
  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.email === email && user.password === password) {
          Alert.alert('Успех', 'Вы успешно вошли!')
          router.replace('/dashboard') // Переход на главную страницу
        } else {
          Alert.alert('Ошибка', 'Неверный email или пароль')
        }
      } else {
        Alert.alert('Ошибка', 'Пользователь не зарегистрирован')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Ошибка', 'Что-то пошло не так')
    }
  }

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" color="main" style={styles.title}>
        Авторизация
      </BaseText>
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
      <PrimaryButton title="Войти" onPress={handleLogin} fluid />
      <PrimaryButton
        title="Нет аккаунта? Зарегистрируйтесь"
        mode="transparent"
        variant="blue"
        size="small"
        onPress={() => router.push('/sign-up')}
        fluid
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  link: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})
