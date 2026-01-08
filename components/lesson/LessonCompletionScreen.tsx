import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useLessonsControllerGetLessonsByModule } from '@/api/generated/lingoStanAPI';
import { useRouter } from 'expo-router';

interface LessonCompletionScreenProps {
  moduleId: number | string;
  lessonId: number;
  lessonTitle?: string;
  onComplete?: () => void;
  isCompleting?: boolean;
}

export const LessonCompletionScreen: React.FC<LessonCompletionScreenProps> = ({
  moduleId,
  lessonId,
  lessonTitle,
  onComplete,
  isCompleting = false,
}) => {
  const router = useRouter();
  const moduleIdNum = typeof moduleId === 'string' ? parseInt(moduleId, 10) : moduleId;

  // Получаем список уроков модуля для поиска следующего урока
  const { data: lessonsResponse } = useLessonsControllerGetLessonsByModule(
    moduleIdNum,
    { query: { enabled: !!moduleIdNum } }
  );

  const lessons = (lessonsResponse?.data as any[]) || [];
  
  // Находим текущий урок и следующий
  const currentLessonIndex = lessons.findIndex((lesson: any) => lesson.id === lessonId);
  const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < lessons.length - 1
    ? lessons[currentLessonIndex + 1]
    : null;

  const handleNextLesson = () => {
    if (nextLesson) {
      router.push(`/modules/${moduleId}/lessons/${nextLesson.id}` as any);
    } else {
      // Если следующего урока нет, возвращаемся назад
      router.back();
    }
  };

  const handleComplete = () => {
    onComplete?.();
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        {lessonTitle ? `${lessonTitle} завершен!` : 'Отличная работа! Ты завершил урок.'}
      </BaseText>
      
      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title="Завершить урок"
          onPress={handleComplete}
          disabled={isCompleting}
          style={styles.completeButton}
        />
        
        {nextLesson && (
          <PrimaryButton
            title="Перейти к следующему уроку"
            onPress={handleNextLesson}
            disabled={isCompleting}
            variant="blue"
            mode="filled"
            style={styles.nextButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    maxWidth: 400,
  },
  completeButton: {
    marginTop: 0,
  },
  nextButton: {
    marginTop: 0,
  },
});

export default LessonCompletionScreen;

