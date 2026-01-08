import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { LessonCard } from '@/components/dashboard/LessonCard';
import type { ModuleResponseDto } from '@/api/generated/models';
import { useLessonsControllerGetLesson } from '@/api/generated/lingoStanAPI';

interface ModuleOverviewProps {
  module: ModuleResponseDto;
  onLessonPress: (moduleId: number | string, lessonId: number | string) => void;
}

const LessonItem: React.FC<{
  lessonId: number;
  index: number;
  onPress: () => void;
}> = ({ lessonId, index, onPress }) => {
  const { data: lessonResponse } = useLessonsControllerGetLesson(lessonId, {
    query: { enabled: !!lessonId },
  });

  const lessonTitle = lessonResponse?.data?.title || `Урок ${index + 1}`;

  return (
    <LessonCard
      key={lessonId}
      title={lessonTitle}
      summary={undefined}
      locked={false}
      completed={false}
      onPress={onPress}
    />
  );
};

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({ module, onLessonPress }) => {
  // lessons теперь массив ID (чисел)
  const lessonIds = Array.isArray(module.lessons) ? module.lessons : [];

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        {module.title}
      </BaseText>
      {module.description ? (
        <BaseText variant="body" color="secondary" style={styles.description}>
          {module.description}
        </BaseText>
      ) : null}

      {module.totalLessons !== undefined && module.totalLessons > 0 && (
        <BaseText variant="caption" color="secondary" style={styles.stats}>
          Уроков: {module.totalLessons} | Упражнений: {module.totalExercises || 0}
        </BaseText>
      )}

      <View style={styles.lessons}>
        {lessonIds.length > 0 ? (
          lessonIds.map((lessonId, index) => (
            <LessonItem
              key={lessonId}
              lessonId={lessonId}
              index={index}
              onPress={() => onLessonPress(module.id, lessonId)}
            />
          ))
        ) : (
          <BaseText variant="body" color="secondary" style={styles.noLessons}>
            Уроки пока не добавлены
          </BaseText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  title: {
    textAlign: 'left',
  },
  description: {
    marginBottom: 4,
  },
  stats: {
    marginBottom: 8,
  },
  lessons: {
    gap: 12,
  },
  noLessons: {
    textAlign: 'center',
    padding: 16,
  },
});

export default ModuleOverview;


