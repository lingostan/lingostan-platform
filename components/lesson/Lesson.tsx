import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useExercisesControllerGetExercisesByLesson, useLessonsControllerCompleteLesson } from '@/api/generated/lingoStanAPI';
import type { ExerciseResponseDto } from '@/api/generated/models';
import { ListeningExercise } from '@/components/exercise/ListeningExercise';
import { MultipleChoiceExercise } from '@/components/exercise/MultipleChoiceExercise';
import { MultipleChoiceImageExercise } from '@/components/exercise/MultipleChoiceImageExercise';
import { MatchingExercise } from '@/components/exercise/MatchingExercise';
import { MatchingAudioExercise } from '@/components/exercise/MatchingAudioExercise';
import { LessonCompletionScreen } from '@/components/lesson/LessonCompletionScreen';
import { getSelectedLanguage } from '@/utils/authUtils';
import { adaptExercises } from '@/utils/exerciseAdapters';

interface LessonProps {
  moduleId: string;
  lessonId: number;
  lessonTitle?: string;
  exerciseId?: number | string;
  onComplete?: (lessonId: number | string) => void;
}

export const Lesson: React.FC<LessonProps> = ({ moduleId, lessonId, lessonTitle, exerciseId, onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponseDto[]>([]); // Сохраняем исходные упражнения для получения ID
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isReadyToCheck, setIsReadyToCheck] = useState(false);
  const [languageId, setLanguageId] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const checkHandlerRef = useRef<(() => boolean | Promise<boolean>) | null>(null);
  const resetHandlerRef = useRef<(() => void) | null>(null);
  const feedbackStateRef = useRef<'idle' | 'correct' | 'incorrect'>(feedbackState);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { mutate: completeLesson } = useLessonsControllerCompleteLesson();

  // Получаем выбранный язык - используем useState с начальным значением
  useEffect(() => {
    const loadLanguage = async () => {
      const langId = await getSelectedLanguage();
      if (langId) {
        setLanguageId(langId);
      }
    };
    loadLanguage();
  }, []);

  // Хук всегда вызывается, но запрос выполняется только когда languageId установлен
  const { data: exercisesResponse, isLoading, error: apiError } = useExercisesControllerGetExercisesByLesson(
    lessonId,
    { 
      query: { 
        enabled: !!languageId && !!lessonId 
      } 
    }
  );

  const registerCheckHandler = useCallback(
    (handler: { check: () => boolean | Promise<boolean>; reset?: () => void } | null) => {
      checkHandlerRef.current = handler?.check ?? null;
      resetHandlerRef.current = handler?.reset ?? null;
    },
    [],
  );

  const handleReadyChange = useCallback((ready: boolean) => {
    if (feedbackStateRef.current === 'idle') {
      setIsReadyToCheck(ready);
    }
  }, []);

  useEffect(() => {
    // API возвращает массив упражнений напрямую
    const exercisesData = (exercisesResponse?.data as ExerciseResponseDto[]) || [];
    if (exercisesData.length > 0) {
      // Сохраняем исходные упражнения для получения ID
      setExercises(exercisesData);
      
      // Адаптируем упражнения из нового формата в старый формат для компонентов
      const adaptedExercises = adaptExercises(exercisesData);
      setQuestions(adaptedExercises);
      
      // Если передан exerciseId, находим индекс этого упражнения
      let initialIndex = 0;
      if (exerciseId !== undefined) {
        const exerciseIdNum = typeof exerciseId === 'string' ? parseInt(exerciseId, 10) : exerciseId;
        const foundIndex = exercisesData.findIndex(ex => ex.id === exerciseIdNum);
        if (foundIndex !== -1) {
          initialIndex = foundIndex;
        }
      }
      
      setCurrentIndex(initialIndex);
      setSelectedOptionId(null);
      setFeedbackState('idle');
      setLessonCompleted(false);
      setIsReadyToCheck(false);
      checkHandlerRef.current = null;
      resetHandlerRef.current = null;
    }
  }, [exercisesResponse, exerciseId]);

  const totalQuestions = questions.length;
  const progressValue = useMemo(() => {
    if (!totalQuestions) {
      return 0;
    }
    if (lessonCompleted) {
      return 1;
    }
    const completedCount = currentIndex + (feedbackState === 'correct' ? 1 : 0);
    return Math.min(completedCount / totalQuestions, 1);
  }, [currentIndex, feedbackState, lessonCompleted, totalQuestions]);

  useEffect(() => {
    if (!isLoading && !apiError) {
      setSelectedOptionId(null);
      setFeedbackState('idle');
      setIsReadyToCheck(false);
      checkHandlerRef.current = null;
      resetHandlerRef.current = null;
    }
  }, [currentIndex, isLoading, apiError]);

  useEffect(() => {
    feedbackStateRef.current = feedbackState;
    if (feedbackState !== 'idle') {
      setIsReadyToCheck(false);
    }
  }, [feedbackState]);

  // Функция для сброса всего прогресса урока и выхода
  // ВАЖНО: Все хуки (включая useCallback) должны быть определены ДО ранних возвратов
  const handleBack = useCallback(() => {
    // Вызываем reset для всех упражнений перед сбросом
    resetHandlerRef.current?.();
    
    // Сбрасываем весь прогресс урока
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setFeedbackState('idle');
    setLessonCompleted(false);
    setIsReadyToCheck(false);
    checkHandlerRef.current = null;
    resetHandlerRef.current = null;
    
    // Всегда возвращаемся на Dashboard
    router.replace('/(tabs)/dashboard');
  }, [router]);

  // Ранние возвраты должны быть после всех хуков
  // Проверяем загрузку языка и данных
  if (!languageId || isLoading) {
    return <LoadingSpinner />;
  }

  // Проверяем ошибки API
  if (apiError) {
    return (
      <View style={styles.errorContainer}>
        <BaseText variant="bodyBold">{'Не удалось загрузить урок'}</BaseText>
      </View>
    );
  }

  // Проверяем наличие упражнений только после загрузки
  if (exercisesResponse && !questions.length) {
    return (
      <View style={styles.errorContainer}>
        <BaseText variant="bodyBold">{'Упражнения не найдены'}</BaseText>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isChoiceQuestion =
    currentQuestion && ['letterIntro', 'selectWord', 'selectImage'].includes(currentQuestion.type);

  const handleSelectOption = (optionId: string) => {
    if (feedbackState !== 'idle') {
      return;
    }
    setSelectedOptionId(prev => {
      const next = prev === optionId ? null : optionId;
      setIsReadyToCheck(next !== null);
      return next;
    });
  };

  const handleCancelSelection = () => {
    if (feedbackState !== 'idle') {
      return;
    }
    if (!currentQuestion) {
      return;
    }

    if (isChoiceQuestion) {
      setSelectedOptionId(null);
    } else {
      resetHandlerRef.current?.();
    }
    setIsReadyToCheck(false);
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || feedbackState !== 'idle') {
      return;
    }

    if (
      currentQuestion.type === 'letterIntro' ||
      currentQuestion.type === 'selectWord' ||
      currentQuestion.type === 'selectImage'
    ) {
      if (!selectedOptionId) {
        return;
      }
      const option = currentQuestion.options.find(opt => opt.id === selectedOptionId);
      const isCorrect = Boolean(option?.isCorrect);
      setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    } else {
      const check = checkHandlerRef.current;
      if (!check) {
        return;
      }
      const result = await check();
      setFeedbackState(result ? 'correct' : 'incorrect');
    }
    setIsReadyToCheck(false);
  };

  const handleRetry = () => {
    if (!currentQuestion) {
      return;
    }

    if (isChoiceQuestion) {
      setSelectedOptionId(null);
    } else {
      resetHandlerRef.current?.();
    }
    setFeedbackState('idle');
    setIsReadyToCheck(false);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentIndex >= totalQuestions - 1;

    if (isLastQuestion) {
      setLessonCompleted(true);
      onComplete?.(lessonId);
    } else {
      const nextIndex = currentIndex + 1;
      const nextExercise = exercises[nextIndex];
      
      // Обновляем URL на новый формат с exerciseId из исходных данных API
      if (nextExercise?.id) {
        router.replace(`/modules/${moduleId}/lessons/${lessonId}/exercises/${nextExercise.id}` as any);
      } else {
        setCurrentIndex(nextIndex);
      }
    }

    setSelectedOptionId(null);
    setFeedbackState('idle');
    setIsReadyToCheck(false);
    checkHandlerRef.current = null;
    resetHandlerRef.current = null;
  };

  const handleCompleteLesson = () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    completeLesson(
      { id: lessonId },
      {
        onSuccess: () => {
          setIsCompleting(false);
          onComplete?.(lessonId);
        },
        onError: (error) => {
          console.error('Ошибка при завершении урока:', error);
          setIsCompleting(false);
        },
      }
    );
  };

  const renderQuestion = () => {
    if (lessonCompleted) {
      return (
        <LessonCompletionScreen
          moduleId={moduleId}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          onComplete={handleCompleteLesson}
          isCompleting={isCompleting}
        />
      );
    }

    if (!currentQuestion) {
      return null;
    }

    switch (currentQuestion.type) {
      case 'letterIntro':
        return (
          <ListeningExercise
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'selectWord':
        return (
          <MultipleChoiceExercise
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'selectImage':
        return (
          <MultipleChoiceImageExercise
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'matchPairs':
      case 'matching':
        return (
          <MatchingExercise
            data={currentQuestion as any}
            feedbackState={feedbackState}
            onReadyChange={handleReadyChange}
            onRegisterCheck={registerCheckHandler}
          />
        );
      case 'matchAudio':
        return (
          <MatchingAudioExercise
            data={currentQuestion as any}
            feedbackState={feedbackState}
            onReadyChange={handleReadyChange}
            onRegisterCheck={registerCheckHandler}
          />
        );
      default:
        return null;
    }
  };

  const showActionPanel =
    !lessonCompleted && currentQuestion && (feedbackState !== 'idle' || isReadyToCheck);

  const isLastQuestion = currentIndex >= totalQuestions - 1;
  const nextButtonLabel = isLastQuestion ? 'Завершить' : 'Далее';

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            {lessonTitle && (
              <BaseText variant="headingM" style={styles.lessonTitle}>
                {lessonTitle}
              </BaseText>
            )}
            <BaseText variant="subtitle">
              {lessonCompleted
                ? 'Урок завершен'
                : `Вопрос ${Math.min(currentIndex + 1, totalQuestions)} из ${totalQuestions}`}
            </BaseText>
          </View>
        </View>
        <Progress.Bar
          progress={progressValue}
          width={null}
          height={10}
          style={styles.progressBar}
          color="#6CD96C"
          unfilledColor="#E0E0E0"
          borderColor="transparent"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderQuestion()}
      </ScrollView>

      {showActionPanel && (
        <View style={[styles.actionPanel, { paddingBottom: insets.bottom + 16 }]}>
          {feedbackState === 'idle' && isReadyToCheck && (
            <View style={styles.checkControls}>
              <PrimaryButton
                title="Проверить"
                onPress={handleCheckAnswer}
                variant="green"
                mode="filled"
                size="medium"
                fluid
              />
              <TouchableOpacity onPress={handleCancelSelection} activeOpacity={0.8}>
                <BaseText variant="bodyBold" style={styles.cancelText}>
                  Отменить
                </BaseText>
              </TouchableOpacity>
            </View>
          )}

          {feedbackState === 'correct' && (
            <View style={styles.feedbackBlock}>
              <BaseText variant="bodyBold" style={styles.successMessage}>
                Правильно
              </BaseText>
              <PrimaryButton
                title={nextButtonLabel}
                onPress={handleNextQuestion}
                variant="green"
                mode="filled"
                size="medium"
                fluid
              />
            </View>
          )}

          {feedbackState === 'incorrect' && (
            <View style={styles.feedbackBlock}>
              <BaseText variant="bodyBold" style={styles.errorMessage}>
                Неправильно
              </BaseText>
              <PrimaryButton
                title="Ответить снова"
                onPress={handleRetry}
                variant="red"
                mode="filled"
                size="medium"
                fluid
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressHeader: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
  },
  lessonTitle: {
    textAlign: 'left',
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 12,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 160,
    gap: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
  },
  checkControls: {
    gap: 12,
  },
  feedbackBlock: {
    gap: 12,
  },
  successMessage: {
    textAlign: 'center',
    color: '#58cc02',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#e74c3c',
  },
  cancelText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default Lesson;


