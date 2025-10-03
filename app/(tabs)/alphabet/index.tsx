import { router } from 'expo-router'
import { useState } from 'react'
import { View, StyleSheet, ScrollView, Button } from 'react-native'
import * as Progress from 'react-native-progress'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import AlphabetGrid from '@/components/AlphabetGrid'
import { BaseText } from '@/components/ui/BaseText'

export default function AlphabetQuiz() {
  const insets = useSafeAreaInsets()
  const [progress, setProgress] = useState(0)
  const [counter, setCounter] = useState({ total: 0, progress: 0 })

  console.log('progress', progress)
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BaseText variant="headingM" style={styles.title}>
          Лакский Алфавит
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
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
    width: '100%',
  },
  conunter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    width: 100,
  },
  header: {
    alignItems: 'stretch',
    flexDirection: 'column',
    padding: 20,
    width: '100%',
  },
  progress: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 0,
    marginLeft: 12,
    minWidth: 300,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
})

AlphabetQuiz.displayName = 'AlphabetQuiz'
