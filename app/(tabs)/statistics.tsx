import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@/components/ui/BaseText';
import * as Progress from 'react-native-progress';

export default function Statistics() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BaseText variant="headingM" style={styles.title}>Статистика</BaseText>
        </View>

        <View style={styles.section}>
          <BaseText variant="subtitle" style={styles.sectionTitle}>Общий прогресс</BaseText>
          <View style={styles.progressContainer}>
            <Progress.Bar 
              progress={0.65} 
              width={null} 
              height={20} 
              color="#6CD96C" 
              unfilledColor="#E0E0E0" 
              borderColor="transparent" 
            />
            <BaseText variant="body" style={styles.progressText}>65% завершено</BaseText>
          </View>
        </View>

        <View style={styles.section}>
          <BaseText variant="subtitle" style={styles.sectionTitle}>Изученные слова</BaseText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BaseText variant="displayL" style={styles.statNumber}>127</BaseText>
              <BaseText variant="body" style={styles.statLabel}>Всего слов</BaseText>
            </View>
            <View style={styles.statItem}>
              <BaseText variant="displayL" style={styles.statNumber}>89</BaseText>
              <BaseText variant="body" style={styles.statLabel}>Изучено</BaseText>
            </View>
            <View style={styles.statItem}>
              <BaseText variant="displayL" style={styles.statNumber}>38</BaseText>
              <BaseText variant="body" style={styles.statLabel}>Осталось</BaseText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <BaseText variant="subtitle" style={styles.sectionTitle}>Активность</BaseText>
          <View style={styles.activityItem}>
            <BaseText variant="bodyBold">Сегодня</BaseText>
            <BaseText variant="body">15 минут изучения</BaseText>
          </View>
          <View style={styles.activityItem}>
            <BaseText variant="bodyBold">На этой неделе</BaseText>
            <BaseText variant="body">2 часа 30 минут</BaseText>
          </View>
          <View style={styles.activityItem}>
            <BaseText variant="bodyBold">Серия дней</BaseText>
            <BaseText variant="body">7 дней подряд</BaseText>
          </View>
        </View>

        <View style={styles.section}>
          <BaseText variant="subtitle" style={styles.sectionTitle}>Достижения</BaseText>
          <View style={styles.achievementItem}>
            <BaseText variant="bodyBold">🏆 Первые шаги</BaseText>
            <BaseText variant="body">Изучите первые 10 слов</BaseText>
          </View>
          <View style={styles.achievementItem}>
            <BaseText variant="bodyBold">📚 Ученик</BaseText>
            <BaseText variant="body">Изучите 50 слов</BaseText>
          </View>
          <View style={styles.achievementItem}>
            <BaseText variant="bodyBold">🎯 Целеустремленный</BaseText>
            <BaseText variant="body">Занимайтесь 7 дней подряд</BaseText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#6CD96C',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  achievementItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});
