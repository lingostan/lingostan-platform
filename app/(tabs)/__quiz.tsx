import { styled } from 'nativewind'
import React, { useState } from 'react'
import { Text, StyleSheet, ScrollView, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { BaseInput } from '@/components/ui/BaseInput'
import { BaseText } from '@/components/ui/BaseText'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function Quiz() {
  // Получаем отступы для безопасной области
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!email.includes('@')) {
      setError('Введите корректный email')
      return
    }
    setError('')
    alert('Форма отправлена!')
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false} // Убирает вертикальную полосу
        showsHorizontalScrollIndicator={false} // Если нужен горизонтальный скролл>
      >
        {/* Заголовок */}

        <BaseInput
          label="Email"
          placeholder="Введите ваш email"
          value={email}
          onChangeText={setEmail}
          error={error}
        />

        <BaseInput
          label="Пароль"
          placeholder="Введите пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-blue-500">Nativewind!</Text>
        </View>
        <Text style={styles.title}>Викторина!</Text>

        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Войти"
          variant="green"
          size="medium"
          mode="filled"
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Регистрация"
          variant="blue"
          size="large"
          mode="filled"
          loading
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Удалить"
          variant="red"
          size="small"
          mode="filled"
          disabled
        />

        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Отмена"
          variant="gray"
          size="medium"
          mode="outline"
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Подробнее"
          variant="blue"
          size="large"
          mode="outline"
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Сохранить"
          variant="green"
          size="small"
          mode="outline"
          disabled
        />

        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Забыли пароль?"
          variant="blue"
          size="medium"
          mode="transparent"
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Не сейчас"
          variant="gray"
          size="small"
          mode="transparent"
        />
        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Доп. опции"
          variant="green"
          size="large"
          mode="transparent"
          disabled
        />

        <PrimaryButton
          onPress={() => console.log('demo')}
          title="Я тут!"
          variant="green"
          size="large"
          mode="filled"
          fluid={true}
        />

        <BaseText variant="displayXL" color="primary">
          Добро пожаловать!
        </BaseText>
        <BaseText variant="headingM" color="main">
          Уровень A1
        </BaseText>
        <BaseText variant="body" color="secondary">
          Продолжи учить урок
        </BaseText>
        <BaseText variant="caption" color="secondary">
          Это вспомогательный текст
        </BaseText>
        <BaseText variant="label" color="main">
          Имя пользователя:
        </BaseText>
        <BaseText
          variant="bodyBold"
          color="light"
          style={{ backgroundColor: '#000' }}
        >
          Текст на тёмном фоне
        </BaseText>
      </ScrollView>
    </SafeAreaView>
  )
}

// Стили
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})
