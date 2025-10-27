import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Progress from 'react-native-progress'; // Импортируем компонент прогресса
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0); // Состояние для отслеживания прогресса

  useEffect(() => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 0.1; // Увеличиваем прогресс каждые 300 мс
      setProgress(progressValue);

      if (progressValue >= 1) {
        clearInterval(interval); // Останавливаем интервал при достижении 100%
        setTimeout(() => {
          router.replace('/dashboard'); // Переход на главную страницу после завершения
        }, 500); // Добавляем задержку в 0.5 секунды перед переходом
      }
    }, 300);

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [router]);

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')} // Укажите путь к вашему фоновому изображению
      style={styles.container}
    >
      {/* Текст с названием приложения */}
      <Text style={styles.title}>Название приложения!</Text>

      {/* Горизонтальная полоса прогресса */}
      <Progress.Bar
        progress={progress} // Прогресс от 0 до 1
        width={null} // Занимает всю доступную ширину
        height={10} // Высота полосы прогресса
        color="#ffffff" // Цвет полосы прогресса
        unfilledColor="rgba(255, 255, 255, 0.3)" // Цвет фона полосы
        borderColor="transparent" // Убираем границу
        style={styles.progress}
      />
    </ImageBackground>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  progress: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    width: '100%', // Полоса занимает 80% ширины экрана
  },
});

export default SplashScreen;
