import { AntDesign } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import { BaseText } from '@/components/ui/BaseText'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

// Типизация данных викторины
type QuizQuestion = {
  audio: any // Путь к аудиофайлу
  options: string[]
  correctAnswer: string
}

const QuizIndex = () => {
  // Состояние текущего вопроса
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null) // Выбранный вариант ответа
  const [showFeedback, setShowFeedback] = useState<boolean>(false) // Показывать обратную связь (правильно/неправильно)
  const [status, setStatus] = useState<null | string>(null)
  const [complete, setComplete] = useState<boolean>(false)

  // Анимация пролистывания
  const offset = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  // Данные викторины
  const quizData: QuizQuestion[] = [
    {
      correctAnswer: 'ажари',
      audio: require('../../../assets/audio/alphabet/lakku/1.mp3'),
      options: ['ажари', 'аньак|и', 'бак|'],
    },
    {
      correctAnswer: 'аньак|и',
      audio: require('../../../assets/audio/alphabet/lakku/2.mp3'),
      options: ['варани', 'ажари', 'аньак|и'],
    },
    // { correctAnswer: 'бак|', audio: require('../../../assets/audio/alphabet/lakku/3.mp3'), options: ['бок', 'бак|', 'бокъ'] },
    // { correctAnswer: 'варани', audio: require('../../../assets/audio/alphabet/lakku/4.mp3'), options: ['варани', 'вамани', 'вани'] },
    // { correctAnswer: 'гунгуми', audio: require('../../../assets/audio/alphabet/lakku/5.mp3'), options: ['гунг1ги', 'гунгуми', 'гусь'] },
    // { correctAnswer: 'гъарал', audio: require('../../../assets/audio/alphabet/lakku/6.mp3'), options: ['гъарал', 'гара', 'гора'] }
  ]

  console.log('selectedOption', selectedOption)
  console.log('showFeedback', showFeedback)
  console.log('currentQuestionIndex', currentQuestionIndex)
  console.log('quizData[currentQuestionIndex]', quizData[currentQuestionIndex])

  // Воспроизведение аудио
  const playSound = async (audioFile: any) => {
    const { sound } = await Audio.Sound.createAsync(audioFile)
    await sound.playAsync()
  }

  // Обработка выбора варианта ответа
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setShowFeedback(true) // Показываем кнопку "Проверить"
  }

  const repeatQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex)
    setShowFeedback(false)
    setStatus(null)
    setSelectedOption(null)
  }

  const completeQuiz = () => {
    setCurrentQuestionIndex(0)
    setShowFeedback(false)
    setStatus(null)
    setSelectedOption(null)
    setComplete(false)
  }

  const nextQuestion = () => {
    setShowFeedback(false)
    setStatus(null)
    setSelectedOption(null)

    if (currentQuestionIndex === quizData.length - 1) {
      setComplete(true)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const highlightOption = (selected: any, option: any) => {
    if (selected === option) {
      return 'blue'
    } else {
      return 'gray'
    }
  }

  // Обработка проверки ответа
  const handleCheckAnswer = () => {
    const currentQuestion = quizData[currentQuestionIndex]
    setShowFeedback(false) // Скрываем кнопку "Проверить"
    if (currentQuestion.correctAnswer === selectedOption) {
      setStatus('correct')
    } else {
      setStatus('incorrect')
    }
    // if (selectedOption === currentQuestion.correctAnswer) {
    //   if (currentQuestionIndex === quizData.length - 1) {
    //     Alert.alert('Поздравляем!', 'Вы успешно прошли викторину!');
    //   }
    // } else {
    //   // Неправильный ответ
    //   setShowFeedback(false); // Скрываем кнопку "Проверить"
    //   Alert.alert('Неверно', 'Давай попробуем еще раз!');
    // }
  }

  const currentQuestion = quizData[currentQuestionIndex]

  if (complete) {
    return (
      <View style={styles.complete}>
        <BaseText variant="headingM" style={styles.completeTitle}>
          Поздравляем! Вы успешно прошли викторину!
        </BaseText>
        <PrimaryButton
          onPress={() => router.push('/dashboard')}
          title="Вернуться на главную"
          variant="green"
          size="large"
          mode="filled"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <BaseText variant="headingM" style={styles.title}>
        Что вы услышали?
      </BaseText>

      {/* Кнопка воспроизведения аудио */}
      <PrimaryButton
        variant="blue"
        mode="filled"
        size="large"
        onPress={() => playSound(currentQuestion.audio)}
      >
        <AntDesign
          name="sound"
          size={40}
          color="#fff"
          style={styles.soundIcon}
        />
      </PrimaryButton>

      {/* Варианты ответов */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <PrimaryButton
            key={index}
            variant={highlightOption(selectedOption, option)}
            size="small"
            mode="outline"
            title={option}
            disabled={showFeedback}
            onPress={() => handleOptionSelect(option)}
          />
        ))}
      </View>

      {/* Кнопка "Проверить" */}
      {showFeedback && selectedOption && (
        <View style={styles.feedbackContainer}>
          <PrimaryButton
            variant="blue"
            size="small"
            mode="filled"
            title="Проверить?"
            onPress={handleCheckAnswer}
          />
        </View>
      )}

      {status === 'correct' && (
        <>
          <View style={[styles.feedbackPanel, styles.correct]}>
            <BaseText
              variant="bodyBold"
              color="green"
              style={styles.feedbackText}
            >
              Вы правильно ответили!
            </BaseText>
            <PrimaryButton
              onPress={() => nextQuestion()}
              title="Следующий вопрос"
              variant="green"
              size="small"
              mode="filled"
            />
          </View>
        </>
      )}
      {status === 'incorrect' && (
        <>
          <View style={[styles.feedbackPanel, styles.incorrect]}>
            <BaseText
              variant="bodyBold"
              color="red"
              style={styles.feedbackText}
            >
              Неверно, давай попробуем еще раз!
            </BaseText>
            <PrimaryButton
              onPress={() => repeatQuestion()}
              title="Повторить"
              variant="red"
              size="small"
              mode="filled"
            />
          </View>
        </>
      )}

      {/* Обратная связь */}
      {/* {!showFeedback && selectedOption && (
        <View style={[styles.feedbackPanel, selectedOption === currentQuestion.correctAnswer ? styles.correct : styles.incorrect]}>
          <Text style={styles.feedbackText}>
            {selectedOption === currentQuestion.correctAnswer
              ? 'Вы правильно ответили!'
              : 'Неверно, давай попробуем еще раз!'}
          </Text>
          
          <PrimaryButton onPress={() => handleCheckAnswer()} title="Следующий вопрос" variant="green" size="medium" mode="filled"  />
          <PrimaryButton onPress={() => setSelectedOption(null)} title="Повторить" variant="red" size="medium" mode="filled"  />
          
          <Button
            title={selectedOption === currentQuestion.correctAnswer ? 'Перейти к следующему вопросу' : 'Повторить'}
            onPress={() => {
              if (selectedOption === currentQuestion.correctAnswer) {
                handleCheckAnswer();
              } else {
                setSelectedOption(null); // Сбрасываем выбранный вариант
              }
            }}
            color="#fff"
          />
        </View>
      )} */}
    </View>
  )
}

// Стили
const styles = StyleSheet.create({
  audio: {
    borderRadius: 16,
    height: 100,
    width: 100,
  },
  complete: {
    backgroundColor: '#d7ffb8', // Зеленый цвет
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    height: '80%',
  },
  completeTitle: {
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
  },
  correct: {
    backgroundColor: '#d7ffb8', // Зеленый цвет
  },
  feedbackContainer: {
    alignSelf: 'center',
    bottom: 20,
    position: 'absolute',
  },
  feedbackPanel: {
    alignItems: 'center',
    bottom: 0,
    height: 100,
    justifyContent: 'center',
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
  },
  feedbackText: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  incorrect: {
    backgroundColor: '#ffdfe0', // Красный цвет
  },

  optionsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default QuizIndex
