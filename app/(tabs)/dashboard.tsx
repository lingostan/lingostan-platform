import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

import { IconButton } from '@/components/ui/IconButton';
import { BaseCaption } from '@/components/ui/BaseCaption';
import { BookIcon } from '@/components/icons/BookIcon';
import { BaseText } from '@/components/ui/BaseText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ModuleOverview } from '@/components/dashboard/ModuleOverview';
import { useListModules } from '@/api/generated/lingoStanAPI';
import type { Module } from '@/api/generated/models';
import { subscribeToProgress, applyProgressToModule, getLessonProgress } from '@/utils/progressStore';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const [modules, setModules] = useState<Module[]>([]);
  
  const { data: modulesResponse, isLoading: isLoadingModules, error: modulesError } = useListModules();

  useEffect(() => {
    if (modulesResponse?.data?.modules) {
      getLessonProgress().then(progress => {
        const modulesWithProgress = modulesResponse.data.modules.map((module: Module) =>
          applyProgressToModule(module, progress)
        );
        setModules(modulesWithProgress);
      });
    }
  }, [modulesResponse]);

  useEffect(() => {
    const unsubscribe = subscribeToProgress(progress => {
      if (modulesResponse?.data?.modules) {
        const modulesWithProgress = modulesResponse.data.modules.map((module: Module) =>
          applyProgressToModule(module, progress)
        );
        setModules(modulesWithProgress);
      }
    });

    return unsubscribe;
  }, [modulesResponse]);

  const { progress, completedLessons, totalLessons } = useMemo(() => {
    const totals = modules.reduce(
      (acc, module) => {
        const completed = module.lessons.filter(lesson => lesson.completed).length;
        const total = module.lessons.length;
        return {
          completed: acc.completed + completed,
          total: acc.total + total,
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
    router.push({
      pathname: '/alphabet/lesson',
      params: { moduleId, lessonId },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <BaseText variant="subtitle" style={styles.progressLabel}>Прогресс курса</BaseText>
            <Progress.Bar 
              progress={progress} 
              width={null} 
              height={12} 
              color="#6CD96C" 
              unfilledColor="#E0E0E0" 
              borderColor="transparent" 
            />
            <BaseText variant="caption" style={styles.progressText}>
              {totalLessons > 0
                ? `${Math.round(progress * 100)}% завершено (${completedLessons}/${totalLessons})`
                : 'Начните первый урок'}
            </BaseText>
          </View>
          <View style={styles.pointsContainer}>
            <AntDesign name="heart" size={24} color="#FF4D4D" />
            <BaseText variant="headingM" style={styles.points}>150</BaseText>
          </View>
        </View>

        {/* Current Module */}
        <View style={styles.module}>
          <BaseCaption title="Модуль 1" desc="Базовые слова" icon={<BookIcon />} variant="green" />
        </View>

        {/* Modules List */}
        <View style={styles.section}>
          <BaseText variant="headingM" style={styles.sectionTitle}>Модули курса</BaseText>
          <View style={styles.modulesContainer}>
            {isLoadingModules ? (
              <LoadingSpinner />
            ) : modulesError ? (
              <BaseText variant="bodyBold" color="red">
                {'Не удалось загрузить список модулей'}
              </BaseText>
            ) : (
              modules.map(module => (
                <ModuleOverview
                  key={module.id}
                  module={module}
                  onLessonPress={handleLessonPress}
                />
              ))
            )}
          </View>
        </View>

        {/* Quiz Section */}
        <View style={styles.section}>
          <BaseText variant="headingM" style={styles.sectionTitle}>Практика и викторины</BaseText>
          <View style={styles.quizGrid}>
            <View style={styles.quizButton}>
              <IconButton 
                icon={<AntDesign name="sound" size={24} color="#fff" />} 
                variant="blue" 
                size="large" 
                onPress={() => router.push('/quiz')} 
              />
              <BaseText variant="body" style={styles.quizButtonText}>Аудио викторина</BaseText>
            </View>
            <View style={styles.quizButton}>
              <IconButton 
                icon={<AntDesign name="picture" size={24} color="#fff" />} 
                variant="green" 
                size="large" 
                onPress={() => router.push('/quiz/guess-image')} 
              />
              <BaseText variant="body" style={styles.quizButtonText}>Викторина по картинкам</BaseText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressLabel: {
    marginBottom: 8,
    color: '#333',
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  points: {
    marginLeft: 8,
    color: '#FF4D4D',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
  },
  module: {
    marginBottom: 20,
  },
  modulesContainer: {
    gap: 16,
  },
  quizGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
  },
  quizButton: {
    alignItems: 'center',
    flex: 1,
  },
  quizButtonText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#666',
  },
});