import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { LessonCard } from './LessonCard';
import type { Module } from '@/api/generated/models';

interface ModuleOverviewProps {
  module: Module;
  onLessonPress: (moduleId: string, lessonId: string) => void;
}

type LessonWithLock = Module['lessons'][number] & { locked: boolean };

const computeLessons = (lessons: Module['lessons']): LessonWithLock[] => {
  let foundFirstIncomplete = false;
  return lessons.map(lesson => {
    const completed = Boolean(lesson.completed);
    const locked = !completed && foundFirstIncomplete;
    if (!completed && !foundFirstIncomplete) {
      foundFirstIncomplete = true;
    }
    return {
      ...lesson,
      locked,
    };
  });
};

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({ module, onLessonPress }) => {
  const lessons = useMemo(() => computeLessons(module.lessons), [module.lessons]);

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

      <View style={styles.lessons}>
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            title={lesson.title}
            summary={lesson.summary}
            locked={lesson.locked}
            completed={Boolean(lesson.completed)}
            onPress={
              lesson.locked
                ? undefined
                : () => onLessonPress(module.id, lesson.id)
            }
          />
        ))}
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
  lessons: {
    gap: 12,
  },
});

export default ModuleOverview;


