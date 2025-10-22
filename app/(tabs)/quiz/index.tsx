import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BaseText } from '@/components/ui/BaseText';
import { router } from 'expo-router';
import { QuizQuestion } from '@/components/ui/QuizQuestion';
import MatchingPairs from '@/components/ui/MatchingPairs';

// Типизация данных викторины
type QuestionType = 'audio' | 'text' | 'match';

type AudioQuestion = {
  type: 'audio';
  title: string;
  audio: any; // Путь к аудиофайлу
  options: string[];
  answer: string;
};

type TextQuestion = {
  type: 'text';
  title: string;
  options: string[];
  answer: string;
};

type MatchQuestion = {
  type: 'match';
  title: string;
  pairs: { left: string; right: string }[];
};

type AnyQuestion = AudioQuestion | TextQuestion | MatchQuestion;

const QuizIndex = () => {
  // Состояние текущего вопроса
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Выбранный вариант ответа
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // Показывать обратную связь (правильно/неправильно)
  const [status, setStatus] = useState<null | string>(null)
  const [complete, setComplete] = useState<boolean>(false)


  // Данные викторины
  const quizData: AnyQuestion[] = useMemo(() => {
    const audioQuestions: AudioQuestion[] = [
      { type: 'audio', title: 'Что вы услышали?', audio: require('../../../assets/audio/alphabet/lakku/1.mp3'), options: ['ажари', 'аньак|и', 'бак|'], answer: 'ажари' },
      { type: 'audio', title: 'Что вы услышали?', audio: require('../../../assets/audio/alphabet/lakku/2.mp3'), options: ['варани', 'ажари', 'аньак|и'], answer: 'аньак|и' },
      { type: 'audio', title: 'Что вы услышали?', audio: require('../../../assets/audio/alphabet/lakku/1.mp3'), options: ['ажари', 'аньак|и', 'бак|'], answer: 'ажари' },
      { type: 'audio', title: 'Что вы услышали?', audio: require('../../../assets/audio/alphabet/lakku/2.mp3'), options: ['варани', 'ажари', 'аньак|и'], answer: 'аньак|и' },
    ];

    const textQuestions: TextQuestion[] = [
      { type: 'text', title: 'Выберите правильный перевод слова', options: ['кот', 'собака', 'птица'], answer: 'кот' },
      { type: 'text', title: 'Выберите правильный перевод слова', options: ['дом', 'река', 'гора'], answer: 'дом' },
      { type: 'text', title: 'Выберите правильный перевод слова', options: ['яблоко', 'груша', 'слива'], answer: 'яблоко' },
      { type: 'text', title: 'Выберите правильный перевод слова', options: ['окно', 'дверь', 'стена'], answer: 'дверь' },
    ];

    const matchQuestions: MatchQuestion[] = [
      { type: 'match', title: 'Сопоставьте пары', pairs: [
        { left: 'cat', right: 'кот' },
        { left: 'dog', right: 'собака' },
        { left: 'bird', right: 'птица' },
      ]},
      { type: 'match', title: 'Сопоставьте пары', pairs: [
        { left: 'house', right: 'дом' },
        { left: 'river', right: 'река' },
        { left: 'mountain', right: 'гора' },
      ]},
      { type: 'match', title: 'Сопоставьте пары', pairs: [
        { left: 'apple', right: 'яблоко' },
        { left: 'pear', right: 'груша' },
        { left: 'plum', right: 'слива' },
      ]},
      { type: 'match', title: 'Сопоставьте пары', pairs: [
        { left: 'window', right: 'окно' },
        { left: 'door', right: 'дверь' },
        { left: 'wall', right: 'стена' },
      ]},
    ];

    return [
      audioQuestions[0], textQuestions[0], matchQuestions[0],
      audioQuestions[1], textQuestions[1], matchQuestions[1],
      audioQuestions[2], textQuestions[2], matchQuestions[2],
      audioQuestions[3], textQuestions[3], matchQuestions[3],
    ];
  }, []);

  // debug logs can be enabled if needed

  // Воспроизведение аудио
  const playSound = async (audioFile: any) => {
    const { sound } = await Audio.Sound.createAsync(audioFile);
    await sound.playAsync();
  };

  // Обработка выбора варианта ответа
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true); // Показываем кнопку "Проверить"
  };

  const repeatQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex);
    setShowFeedback(false);
    setStatus(null);
    setSelectedOption(null);
  }

  const completeQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    setStatus(null);
    setSelectedOption(null);
    setComplete(false);
  }

  const nextQuestion = () => {
    setShowFeedback(false);
    setStatus(null);
    setSelectedOption(null);

    if (currentQuestionIndex === quizData.length - 1) {
      setComplete(true);
    } else {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const highlightOption = (selected: any, option: any) => {
    if (selected === option) {
      return "blue"
    } else {
      return "gray"
    }
  }

  // Обработка проверки ответа
  const handleCheckAnswer = () => {
    const currentQuestion = quizData[currentQuestionIndex];
    if (currentQuestion.type === 'match') return;
    setShowFeedback(false);
    if ('answer' in currentQuestion && currentQuestion.answer === selectedOption) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const currentQuestion = quizData[currentQuestionIndex];

  if (complete) {
    return (
    <View style={styles.complete}>
      <BaseText variant="headingM" style={styles.completeTitle}>Поздравляем! Вы успешно прошли викторину!</BaseText>
      <PrimaryButton onPress={() => router.push('/dashboard')} title="Вернуться на главную" variant="green" size="large" mode="filled"  />
    </View>
    )
  }

  return (
    <View style={styles.container}>
      {currentQuestion.type !== 'match' && (
        <QuizQuestion
          title={currentQuestion.title}
          options={currentQuestion.options}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onPlayAudio={currentQuestion.type === 'audio' ? () => playSound((currentQuestion as any).audio) : undefined}
          disabled={showFeedback}
        />
      )}

      {currentQuestion.type === 'match' && (
        <MatchingPairs
          title={currentQuestion.title}
          pairs={(currentQuestion as any).pairs}
          disabled={false}
          onSolved={() => setStatus('correct')}
        />
      )}

      {currentQuestion.type !== 'match' && showFeedback && selectedOption && (
        <View style={styles.feedbackContainer}>
          <PrimaryButton variant="blue" size="small" mode="filled" title="Проверить?" onPress={handleCheckAnswer} />
        </View>
      )}

      {status === 'correct' && (
        <View style={[styles.feedbackPanel, styles.correct]}>
          <BaseText variant="bodyBold" color="green" style={styles.feedbackText}>
            Вы правильно ответили!
          </BaseText>
          <PrimaryButton onPress={() => nextQuestion()} title="Следующий вопрос" variant="green" size="small" mode="filled" />
        </View>
      )}

      {status === 'incorrect' && (
        <View style={[styles.feedbackPanel, styles.incorrect]}>
          <BaseText variant="bodyBold" color="red" style={styles.feedbackText}>
            Неверно, давай попробуем еще раз!
          </BaseText>
          <PrimaryButton onPress={() => repeatQuestion()} title="Повторить" variant="red" size="small" mode="filled" />
        </View>
      )}
    </View>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  optionsContainer: {
    marginTop: 20,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  feedbackPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  correct: {
    backgroundColor: '#d7ffb8', // Зеленый цвет
  },
  incorrect: {
    backgroundColor: '#ffdfe0', // Красный цвет
  },
  feedbackText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  audio: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },

  complete: {
    backgroundColor: '#d7ffb8', // Зеленый цвет
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    height: '80%'
  },
  completeTitle: {
    textAlign: 'center'
  },
  soundIcon: {
    marginRight: 10,
  }
});

export default QuizIndex;