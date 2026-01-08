import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExercisesControllerGetExercisesByLesson } from '@/api/generated/lingoStanAPI';
import { getSelectedLanguage } from '@/utils/authUtils';
import { useState } from 'react';

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; lessonId: string }>();
  const router = useRouter();
  const [languageId, setLanguageId] = useState<string | null>(null);

  const moduleId = params.id || '1';
  const lessonId = params.lessonId ? parseInt(params.lessonId, 10) : 1;

  // Получаем выбранный язык
  useEffect(() => {
    const loadLanguage = async () => {
      const langId = await getSelectedLanguage();
      setLanguageId(langId);
    };
    loadLanguage();
  }, []);

  // Получаем упражнения урока
  const { data: exercisesResponse, isLoading } = useExercisesControllerGetExercisesByLesson(
    lessonId,
    { 
      query: { 
        enabled: !!languageId && !!lessonId 
      } 
    }
  );

  // Перенаправляем на первое упражнение, если упражнения загружены
  useEffect(() => {
    if (exercisesResponse?.data && exercisesResponse.data.length > 0) {
      const firstExercise = exercisesResponse.data[0];
      if (firstExercise?.id) {
        router.replace(`/modules/${moduleId}/lessons/${lessonId}/exercises/${firstExercise.id}` as any);
      }
    }
  }, [exercisesResponse, moduleId, lessonId, router]);

  if (isLoading || !languageId) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6CD96C" />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

