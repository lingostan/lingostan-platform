import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { BaseText } from '@/components/ui/BaseText';

export const QuizSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <BaseText variant="headingM" style={styles.sectionTitle}>
        Практика и викторины
      </BaseText>
      <View style={styles.quizGrid}>
        <View style={styles.quizButton}>
          <IconButton
            icon={<AntDesign name="sound" size={24} color="#fff" />}
            variant="blue"
            size="large"
            onPress={() => router.push('/quiz')}
          />
          <BaseText variant="body" style={styles.quizButtonText}>
            Аудио викторина
          </BaseText>
        </View>
        <View style={styles.quizButton}>
          <IconButton
            icon={<AntDesign name="picture" size={24} color="#fff" />}
            variant="green"
            size="large"
            onPress={() => router.push('/quiz/guess-image')}
          />
          <BaseText variant="body" style={styles.quizButtonText}>
            Викторина по картинкам
          </BaseText>
        </View>
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

