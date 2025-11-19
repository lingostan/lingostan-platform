import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BaseText } from '@/components/ui/BaseText';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGetModuleById } from '@/api/generated/lingoStanAPI';

interface ModuleLessonsProps {
  moduleId: string;
  initialLessonId?: string;
}

export const ModuleLessons: React.FC<ModuleLessonsProps> = ({
  moduleId,
  initialLessonId,
}) => {
  const { data: moduleResponse, isLoading, error: apiError } = useGetModuleById(moduleId);

  const moduleData = moduleResponse?.data || null;

  const lessonsWithStatus = useMemo(() => {
    if (!moduleData) {
      return [];
    }
    let foundFirstIncomplete = false;
    return moduleData.lessons.map(lesson => {
      const completed = Boolean(lesson.completed);
      const locked = !completed && foundFirstIncomplete;
      if (!completed && !foundFirstIncomplete) {
        foundFirstIncomplete = true;
      }
      return {
        ...lesson,
        completed,
        locked,
      };
    });
  }, [moduleData]);

  // Если передан initialLessonId, сразу открываем урок
  useEffect(() => {
    if (initialLessonId && moduleData) {
      const lesson = lessonsWithStatus.find(l => l.id === initialLessonId);
      if (lesson && !lesson.locked) {
        router.push(`/modules/${moduleId}/lesson/${initialLessonId}` as any);
      }
    }
  }, [initialLessonId, moduleData, moduleId, lessonsWithStatus]);

  const handleLessonSelect = (lessonId: string) => {
    const lesson = lessonsWithStatus.find(item => item.id === lessonId);
    if (!lesson || lesson.locked) {
      return;
    }
    // Навигация к уроку через роутинг
    router.push(`/modules/${moduleId}/lesson/${lessonId}` as any);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (apiError || !moduleData) {
    return (
      <View style={styles.errorContainer}>
        <BaseText variant="bodyBold">{'Модуль не найден'}</BaseText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        {moduleData.title}
      </BaseText>
      <BaseText variant="body" color="secondary" style={styles.subtitle}>
        {moduleData.description}
      </BaseText>

      <View style={styles.lessonList}>
        {lessonsWithStatus.map(lesson => {
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonChip,
                lesson.locked && styles.lessonChipLocked,
              ]}
              onPress={() => handleLessonSelect(lesson.id)}
              disabled={lesson.locked}
            >
              <View style={styles.lessonChipContent}>
                <BaseText variant="bodyBold">
                  {lesson.title}
                </BaseText>
                {lesson.locked ? (
                  <AntDesign name="lock" size={14} color="#666" />
                ) : lesson.completed ? (
                  <AntDesign name="checkcircle" size={14} color="#58cc02" />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  lessonList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginVertical: 16,
  },
  lessonChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  lessonChipLocked: {
    opacity: 0.5,
  },
  lessonChipActive: {
    backgroundColor: '#58cc02',
  },
  lessonChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModuleLessons;


