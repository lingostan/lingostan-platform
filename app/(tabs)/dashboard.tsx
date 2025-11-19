import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListModules } from '@/api/generated/lingoStanAPI';
import type { Module } from '@/api/generated/models';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CurrentModule } from '@/components/dashboard/CurrentModule';
import { ModulesSection } from '@/components/dashboard/ModulesSection';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  
  const { data: modulesResponse, isLoading: isLoadingModules, error: modulesError } = useListModules();

  const modules = modulesResponse?.data?.modules || [];

  // Вычисляем общий прогресс из данных API
  const { progress, completedLessons, totalLessons } = useMemo(() => {
    if (modules.length === 0) {
      return { progress: 0, completedLessons: 0, totalLessons: 0 };
    }

    const totals = modules.reduce(
      (acc: { completed: number; total: number }, module: Module) => {
        return {
          completed: acc.completed + (module.completedLessons || 0),
          total: acc.total + (module.totalLessons || 0),
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

  const handleLessonPress = (moduleId: string, lessonId: string) => {
    router.push(`/modules/${moduleId}/lesson/${lessonId}` as any);
  };

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

        <CurrentModule />

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
});