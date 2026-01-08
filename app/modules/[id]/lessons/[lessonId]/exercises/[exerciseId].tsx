import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Lesson from '@/components/lesson/Lesson';
import { markLessonCompleted } from '@/utils/progressStore';
import { useLessonsControllerGetLesson } from '@/api/generated/lingoStanAPI';

export default function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; lessonId: string; exerciseId: string }>();
  const router = useRouter();

  const moduleId = params.id || '1';
  const lessonId = params.lessonId ? parseInt(params.lessonId, 10) : 1;
  const exerciseId = params.exerciseId ? (isNaN(parseInt(params.exerciseId, 10)) ? params.exerciseId : parseInt(params.exerciseId, 10)) : undefined;

  // Получаем информацию об уроке для отображения title
  const { data: lessonResponse } = useLessonsControllerGetLesson(lessonId, {
    query: { enabled: !!lessonId },
  });

  const lessonTitle = lessonResponse?.data?.title;

  const handleLessonComplete = (completedLessonId: number | string) => {
    markLessonCompleted(String(completedLessonId));
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Lesson
        moduleId={moduleId}
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        exerciseId={exerciseId}
        onComplete={handleLessonComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

