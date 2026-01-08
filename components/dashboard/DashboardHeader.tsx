import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { AntDesign } from '@expo/vector-icons';
import { BaseText } from '@/components/ui/BaseText';

interface DashboardHeaderProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  points?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  progress,
  completedLessons,
  totalLessons,
  points = 150,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.progressContainer}>
        <BaseText variant="subtitle" style={styles.progressLabel}>
          Прогресс курса
        </BaseText>
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
        <BaseText variant="headingM" style={styles.points}>
          {points}
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

