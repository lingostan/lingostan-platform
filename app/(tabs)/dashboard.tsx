import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, FlatList, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import { AntDesign } from '@expo/vector-icons';
import { IconButton } from '@/components/ui/IconButton';
import { StarIcon } from '@/components/icons/StarIcon';
import { BaseCaption } from '@/components/ui/BaseCaption';
import { BookIcon } from '@/components/icons/BookIcon';

import { router } from 'expo-router';

export default function Dashboard() {
  // Получаем отступы для безопасной области
  const insets = useSafeAreaInsets();
  const steps = [
    { id: 0, title: 'Модуль 0: Алфавит', completed: true },
    { id: 1, title: 'Модуль 1: Базовые слова', completed: false },
    { id: 2, title: 'Модуль 2: Практикуем предложения', completed: false },
  ];

  return (
    <ImageBackground
      source={require('@/assets/images/dashboard_bg.jpg')}
      resizeMode='cover'
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
                <Progress.Bar progress={0.5} width={150} height={10} color="#6CD96C" unfilledColor="#E0E0E0" borderColor="transparent" />

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
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContainer}
                  renderItem={({ item }) => (
                    <View style={[styles.step, item.completed && styles.completedStep]}>
                      <Text style={styles.stepTitle}>{item.title}</Text>
                      {item.completed && <AntDesign name="checkcircle" size={20} color="#6CD96C" />}
                    </View>
                  )}
                />
              </View>
              <View style={styles.module}>
                <BaseCaption title='Модуль 1' desc='Базовые слова' icon={<BookIcon />} variant='green'/>
              </View>
              
              <View style={styles.stepList}>
                <View style={styles.step1}>
                    <IconButton
                    icon={<StarIcon />}
                    onPress={() => {
                      router.push('/alphabet')
                    }}
                    variant="green"
                    size='large'
                  />
                </View>
                <View style={styles.step2}>
                    <IconButton
                    icon={<StarIcon />}
                    onPress={() => console.log('SVG кнопка')}
                    variant="green"
                    size='large'
                  />
                </View>
                <View style={styles.step3}>
                    <IconButton
                    icon={<StarIcon />}
                    onPress={() => console.log('SVG кнопка')}
                    variant="green"
                    size='large'
                  />
                </View>
                <View style={styles.step4}>
                    <IconButton
                    icon={<StarIcon />}
                    onPress={() => console.log('SVG кнопка')}
                    variant="green"
                    size='large'
                  />
                </View>
                <View style={styles.step5}>
                    <IconButton
                    icon={<StarIcon />}
                    onPress={() => console.log('SVG кнопка')}
                    variant="green"
                    size='large'
                  />
                </View>
              </View>
              
          </View>
          </SafeAreaView>
    </ImageBackground>
    
  );
};

// Стили
const styles = StyleSheet.create({
  bgwrap: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flag: {
    width: 30,
    height: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4D4D',
  },
  listContainer: {
    padding: 20,
    flexGrow: 0,
    flexShrink: 1
  },
  step: {
    flexShrink: 1,
    flexGrow: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedStep: {
    opacity: 0.6,
  },
  stepTitle: {
    fontSize: 16,
  },
  step1: {
    marginRight: 0,
    alignSelf: 'center'
  },
  step2: {
    marginRight: 50,
    alignSelf: 'center'
  },
  step3: {
    marginRight: 100,
    alignSelf: 'center'
  },
  step4: {
    marginRight: 150,
    alignSelf: 'center'
  },
  step5: {
    marginRight: 100,
    alignSelf: 'center'
  },
  stepList: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  module: {
    padding: 20,
    marginBottom: 30
  }
});
