// components/AuthGuard.js
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'

import { checkAuth } from '../utils/authUtils'

export default function AuthGuard({ children }: any) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true) // Состояние загрузки

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth() // Проверяем авторизацию
      if (!isAuthenticated) {
        router.replace('/sign-in') // Перенаправляем на страницу авторизации
      }
      setIsLoading(false) // Завершаем загрузку
    }

    verifyAuth()
  }, 
  
  
  [router])

  // Показываем спиннер, пока проверяется авторизация
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  // Если авторизация успешна, отображаем дочерние компоненты
  return children
}

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
})
