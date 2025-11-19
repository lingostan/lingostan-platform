import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGetLessonExercises } from '@/api/generated/lingoStanAPI';
import type { Exercise } from '@/api/generated/models';
import { LetterIntroQuestion } from '@/components/questions/letter-intro/LetterIntroQuestion';
import { SelectWordQuestion } from '@/components/questions/select-word/SelectWordQuestion';
import { SelectImageQuestion } from '@/components/questions/select-image/SelectImageQuestion';
import { FindPairQuestion } from '@/components/questions/match-pairs/FindPairQuestion';
import { FindAudioPairQuestion } from '@/components/questions/match-audio/FindAudioPairQuestion';

interface LessonProps {
  moduleId: string;
  lessonId: string;
  lessonTitle?: string;
  onComplete?: (lessonId: string) => void;
}

export const Lesson: React.FC<LessonProps> = ({ moduleId, lessonId, lessonTitle, onComplete }) => {
  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isReadyToCheck, setIsReadyToCheck] = useState(false);
  const checkHandlerRef = useRef<(() => boolean | Promise<boolean>) | null>(null);
  const resetHandlerRef = useRef<(() => void) | null>(null);
  const feedbackStateRef = useRef<'idle' | 'correct' | 'incorrect'>(feedbackState);
  const insets = useSafeAreaInsets();

  const { data: exercisesResponse, isLoading, error: apiError } = useGetLessonExercises(moduleId, lessonId);

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
    if (exercisesResponse?.data?.exercises) {
      setQuestions(exercisesResponse.data.exercises);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setFeedbackState('idle');
      setLessonCompleted(false);
      setIsReadyToCheck(false);
      checkHandlerRef.current = null;
      resetHandlerRef.current = null;
    }
  }, [exercisesResponse]);

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (apiError || !questions.length) {
    return (
      <View style={styles.errorContainer}>
        <BaseText variant="bodyBold">{'Не удалось загрузить урок'}</BaseText>
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
      setCurrentIndex(index => index + 1);
    }

    setSelectedOptionId(null);
    setFeedbackState('idle');
    setIsReadyToCheck(false);
    checkHandlerRef.current = null;
    resetHandlerRef.current = null;
  };

  const renderQuestion = () => {
    if (lessonCompleted) {
      return (
        <View style={styles.completionContainer}>
          <BaseText variant="headingM" style={styles.completionTitle}>
            {lessonTitle ? `${lessonTitle} завершен!` : 'Отличная работа! Ты завершил урок.'}
          </BaseText>
        </View>
      );
    }

    if (!currentQuestion) {
      return null;
    }

    switch (currentQuestion.type) {
      case 'letterIntro':
        return (
          <LetterIntroQuestion
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'selectWord':
        return (
          <SelectWordQuestion
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'selectImage':
        return (
          <SelectImageQuestion
            data={currentQuestion}
            selectedOptionId={selectedOptionId}
            feedbackState={feedbackState}
            onSelectOption={handleSelectOption}
          />
        );
      case 'matchPairs':
        return (
          <FindPairQuestion
            data={currentQuestion}
            feedbackState={feedbackState}
            onReadyChange={handleReadyChange}
            onRegisterCheck={registerCheckHandler}
          />
        );
      case 'matchAudio':
        return (
          <FindAudioPairQuestion
            data={currentQuestion}
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
  lessonTitle: {
    textAlign: 'center',
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
  completionContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  completionTitle: {
    textAlign: 'center',
  },
});

export default Lesson;


