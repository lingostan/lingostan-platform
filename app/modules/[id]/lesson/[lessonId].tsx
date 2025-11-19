import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Lesson from '@/components/lesson/Lesson';
import { markLessonCompleted } from '@/utils/progressStore';

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; lessonId: string }>();
  const router = useRouter();

  const moduleId = params.id || 'module-1';
  const lessonId = params.lessonId || 'lesson-1';

  const handleLessonComplete = (completedLessonId: string) => {
    markLessonCompleted(completedLessonId);
    // Можно вернуться назад или перейти к следующему уроку
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Lesson
        moduleId={moduleId}
        lessonId={lessonId}
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

