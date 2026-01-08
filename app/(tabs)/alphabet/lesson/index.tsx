import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ModuleLessons from '@/components/lesson/ModuleLessons';
import { useLocalSearchParams } from 'expo-router';

export default function FirstLessonScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ moduleId?: string; lessonId?: string }>();

  const moduleId =
    typeof params.moduleId === 'string' && params.moduleId.length > 0
      ? params.moduleId
      : 'module-1';
  const lessonId =
    typeof params.lessonId === 'string' && params.lessonId.length > 0
      ? params.lessonId
      : undefined;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ModuleLessons moduleId={moduleId} initialLessonId={lessonId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
});


