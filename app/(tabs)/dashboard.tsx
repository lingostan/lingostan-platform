import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { verifyInstallation } from 'nativewind'
import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native'
import * as Progress from 'react-native-progress'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { BookIcon } from '@/components/icons/BookIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { BaseCaption } from '@/components/ui/BaseCaption'
import { IconButton } from '@/components/ui/IconButton'

import '../../global.css'
import { path } from '@/constants/Path'

export default function Dashboard() {
  // Получаем отступы для безопасной области
  const insets = useSafeAreaInsets()
  const steps = [
    { id: 0, title: 'Модуль 0: Алфавит', completed: true },
    { id: 1, title: 'Модуль 1: Базовые слова', completed: false },
    { id: 2, title: 'Модуль 2: Практикуем предложения', completed: false },
  ]

  return (
    <ImageBackground
      source={require('@/assets/images/dashboard_bg.jpg')}
      resizeMode="cover"
      style={styles.bgwrap} // путь к твоему изображению
    >
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Заголовок */}
        <View style={styles.container}>
          {/* Шапка */}
          <View style={styles.header}>
            {/* Левая часть: Флаг России */}
            {/* <Image source={require('@/assets/russia-flag.png')} style={styles.flag} /> */}

            {/* Центральная часть: Шкала прогресса */}
            <Progress.Bar
              progress={0.5}
              width={150}
              height={10}
              color="#6CD96C"
              unfilledColor="#E0E0E0"
              borderColor="transparent"
            />

            {/* Правая часть: Иконка сердца с очками */}
            <View style={styles.pointsContainer}>
              <AntDesign name="heart" size={24} color="#FF4D4D" />
              <Text style={styles.points}>150</Text>
            </View>
          </View>

          {/* Основной контент: Дорожка с шагами */}
          <View>
            <FlatList
              data={steps}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View
                  style={[styles.step, item.completed && styles.completedStep]}
                >
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  {item.completed && (
                    <AntDesign name="checkcircle" size={20} color="#6CD96C" />
                  )}
                </View>
              )}
            />
          </View>
          <View style={styles.module}>
            <BaseCaption
              title="Модуль 1"
              desc="Базовые слова"
              icon={<BookIcon />}
              variant="green"
            />
          </View>

          <View style={styles.stepList}>
            <View style={styles.step1}>
              <IconButton
                icon={<StarIcon />}
                onPress={() => {
                  router.push('/alphabet')
                }}
                variant="green"
                size="large"
              />
            </View>
            <View style={styles.step2}>
              <IconButton
                icon={<StarIcon />}
                onPress={() => console.log('SVG кнопка')}
                variant="green"
                size="large"
              />
            </View>
            <View style={styles.step3}>
              <IconButton
                icon={<StarIcon />}
                onPress={() => console.log('SVG кнопка')}
                variant="green"
                size="large"
              />
            </View>
            <View style={styles.step4}>
              <IconButton
                icon={<StarIcon />}
                onPress={() => console.log('SVG кнопка')}
                variant="green"
                size="large"
              />
            </View>
            <View style={styles.step5}>
              <IconButton
                icon={<StarIcon />}
                onPress={() => {router.push(path.audioWordMap)}}
                variant="green"
                size="large"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

// Стили
const styles = StyleSheet.create({
  bgwrap: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  completedStep: {
    opacity: 0.6,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  flag: {
    height: 20,
    width: 30,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  listContainer: {
    flexGrow: 0,
    flexShrink: 1,
    padding: 20,
  },
  module: {
    marginBottom: 30,
    padding: 20,
  },
  points: {
    color: '#FF4D4D',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pointsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  step: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  step1: {
    alignSelf: 'center',
    marginRight: 0,
  },
  step2: {
    alignSelf: 'center',
    marginRight: 50,
  },
  step3: {
    alignSelf: 'center',
    marginRight: 100,
  },
  step4: {
    alignSelf: 'center',
    marginRight: 150,
  },
  step5: {
    alignSelf: 'center',
    marginRight: 100,
  },
  stepList: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 16,
  },
})
