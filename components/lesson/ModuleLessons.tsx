import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BaseText } from '@/components/ui/BaseText';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGetModuleById } from '@/api/generated/lingoStanAPI';
import type { Module } from '@/api/generated/models';
import { markLessonCompleted, getLessonProgress, applyProgressToModule } from '@/utils/progressStore';
import Lesson from './Lesson';

interface ModuleLessonsProps {
  moduleId: string;
  initialLessonId?: string;
}

export const ModuleLessons: React.FC<ModuleLessonsProps> = ({
  moduleId,
  initialLessonId,
}) => {
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(initialLessonId ?? null);
  const [lessonTitle, setLessonTitle] = useState<string | undefined>(undefined);
  
  const { data: moduleResponse, isLoading, error: apiError } = useGetModuleById(moduleId);

  useEffect(() => {
    if (moduleResponse?.data) {
      getLessonProgress().then(progress => {
        const moduleWithProgress = applyProgressToModule(moduleResponse.data, progress);
        setModuleData(moduleWithProgress);
        setSelectedLessonId(initialLessonId ?? null);
      });
    }
  }, [moduleResponse, initialLessonId]);

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

  useEffect(() => {
    if (!selectedLessonId && lessonsWithStatus.length > 0) {
      const firstAvailable = lessonsWithStatus.find(lesson => !lesson.locked);
      setSelectedLessonId(firstAvailable?.id ?? null);
      setLessonTitle(firstAvailable?.title);
    } else if (selectedLessonId) {
      const current = lessonsWithStatus.find(lesson => lesson.id === selectedLessonId);
      if (!current) {
        const firstAvailable = lessonsWithStatus.find(lesson => !lesson.locked);
        setSelectedLessonId(firstAvailable?.id ?? null);
        setLessonTitle(firstAvailable?.title);
      } else {
        if (current.locked) {
          const firstAvailable = lessonsWithStatus.find(lesson => !lesson.locked);
          setSelectedLessonId(firstAvailable?.id ?? null);
          setLessonTitle(firstAvailable?.title);
        } else {
          setLessonTitle(current.title);
        }
      }
    }
  }, [lessonsWithStatus, selectedLessonId]);

  const handleLessonSelect = (lessonId: string) => {
    const lesson = lessonsWithStatus.find(item => item.id === lessonId);
    if (!lesson || lesson.locked) {
      return;
    }
    setSelectedLessonId(lessonId);
    setLessonTitle(lesson.title);
  };

  const handleLessonComplete = (lessonId: string) => {
    void markLessonCompleted(lessonId);
    setModuleData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lessons: prev.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
        ),
      };
    });
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
          const isSelected = selectedLessonId === lesson.id;
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonChip,
                lesson.locked && styles.lessonChipLocked,
                isSelected && styles.lessonChipActive,
              ]}
              onPress={() => handleLessonSelect(lesson.id)}
              disabled={lesson.locked}
            >
              <View style={styles.lessonChipContent}>
                <BaseText
                  variant="bodyBold"
                  style={isSelected ? styles.lessonChipTextActive : undefined}
                >
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

      {selectedLessonId && (
        <View style={styles.lessonContainer}>
          <Lesson
            moduleId={moduleId}
            lessonId={selectedLessonId}
            lessonTitle={lessonTitle}
            onComplete={handleLessonComplete}
          />
        </View>
      )}
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
  lessonChipTextActive: {
    color: '#fff',
  },
  lessonChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  lessonContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModuleLessons;


