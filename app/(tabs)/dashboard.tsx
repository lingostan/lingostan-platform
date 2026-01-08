import React, { useMemo, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useModsControllerGetAllModules, useLessonsControllerStartLesson } from '@/api/generated/lingoStanAPI';
import type { ModuleResponseDto } from '@/api/generated/models';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ModulesSection } from '@/components/module/ModulesSection';
import { getSelectedLanguage } from '@/utils/authUtils';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [isCheckingLanguage, setIsCheckingLanguage] = useState(true);
  
  // Загрузка выбранного языка при монтировании компонента
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // Проверяем наличие выбранного языка
        const languageId = await getSelectedLanguage();
        if (!languageId) {
          // Если язык не выбран, перенаправляем на страницу выбора языка
          router.replace('/select-language');
          return;
        }
        
        setSelectedLanguageId(languageId);
        setIsCheckingLanguage(false);
      } catch (error) {
        console.error('Ошибка при загрузке языка:', error);
        setIsCheckingLanguage(false);
      }
    };

    loadLanguage();
  }, []);

  const { data: modulesResponse, isLoading: isLoadingModules, error: modulesError } = useModsControllerGetAllModules(
    selectedLanguageId ? { languageId: Number(selectedLanguageId) } : undefined,
    { query: { enabled: !!selectedLanguageId } }
  );

  // API возвращает массив модулей напрямую
  const modules = (modulesResponse?.data as ModuleResponseDto[]) || [];

  // Вычисляем общий прогресс из данных API
  const { progress, completedLessons, totalLessons } = useMemo(() => {
    if (modules.length === 0) {
      return { progress: 0, completedLessons: 0, totalLessons: 0 };
    }

    const totals = modules.reduce(
      (acc: { completed: number; total: number }, module: ModuleResponseDto) => {
        return {
          completed: acc.completed + (module.completed ? 1 : 0),
          total: acc.total + module.totalLessons,
        };
      },
      { completed: 0, total: 0 },
    );

    return {
      progress: totals.total > 0 ? totals.completed / totals.total : 0,
      completedLessons: totals.completed,
      totalLessons: totals.total,
    };
  }, [modules]);

  const { mutate: startLesson } = useLessonsControllerStartLesson();

  const handleLessonPress = (moduleId: number | string, lessonId: number | string) => {
    // Отправляем запрос на старт урока
    startLesson(
      { id: Number(lessonId) },
      {
        onSuccess: () => {
          router.push(`/modules/${moduleId}/lessons/${lessonId}` as any);
        },
        onError: (error) => {
          console.error('Ошибка при старте урока:', error);
          // Все равно переходим на урок даже при ошибке
          router.push(`/modules/${moduleId}/lessons/${lessonId}` as any);
        },
      }
    );
  };

  // Показываем индикатор загрузки во время проверки языка
  if (isCheckingLanguage) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6CD96C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DashboardHeader
          progress={progress}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
        />

        <ModulesSection
          modules={modules}
          isLoading={isLoadingModules}
          error={modulesError}
          onLessonPress={handleLessonPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});