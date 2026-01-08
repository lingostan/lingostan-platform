import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ModuleOverview } from '@/components/module/ModuleOverview';
import type { ModuleResponseDto } from '@/api/generated/models';

interface ModulesSectionProps {
  modules: ModuleResponseDto[];
  isLoading: boolean;
  error: unknown;
  onLessonPress: (moduleId: string, lessonId: string) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({
  modules,
  isLoading,
  error,
  onLessonPress,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.modulesContainer}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <BaseText variant="bodyBold" color="red">
            {'Не удалось загрузить список модулей'}
          </BaseText>
        ) : (
          modules.map(module => (
            <ModuleOverview
              key={module.id}
              module={module}
              onLessonPress={onLessonPress}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
  },
  modulesContainer: {
    gap: 16,
  },
});

