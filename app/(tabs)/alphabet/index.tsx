import { View, StyleSheet, ScrollView, Button } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AlphabetGrid from '@/components/AlphabetGrid';
import { BaseText } from '@/components/ui/BaseText';
import * as Progress from 'react-native-progress';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function AlphabetQuiz() {
  const { user, setActiveLang, activeLang } = useUserStore();

  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState({ total: 0, progress: 0 });

  useEffect(() => {
    if (activeLang?.code) {
      setProgress(0);
    }
  }, [activeLang]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {user &&
          user.languages.length > 1 &&
          user?.languages.map((lang) => (
            <Button
              title={lang.language.name}
              key={lang.id}
              onPress={() => {
                setActiveLang(lang.language);
                window.localStorage.setItem(
                  'activeLang',
                  JSON.stringify(lang.language)
                );
              }}
            />
          ))}
        <BaseText variant="headingM" style={styles.title}>
          {activeLang?.name} Алфавит
        </BaseText>
        <Progress.Bar
          progress={progress}
          width={null}
          height={10}
          color="#6CD96C"
          unfilledColor="#E0E0E0"
          borderColor="transparent"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false} // Убирает вертикальную полосу
        showsHorizontalScrollIndicator={false} // Если нужен горизонтальный скролл>
      >
        <View>
          <AlphabetGrid setProgress={setProgress} setCounter={setCounter} />
          {/* <Button title="Go to Lesson A" onPress={() => router.push('/alphabet/A')} />
                <Button title="Go to Lesson B" onPress={() => router.push('/alphabet/B')} /> */}
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
    width: '100%',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 20,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  progress: {
    flexDirection: 'row',
    marginLeft: 12,
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 300,
  },
  conunter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    width: 100,
  },
});

AlphabetQuiz.displayName = 'AlphabetQuiz';
