import { Stack } from 'expo-router'

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Quiz' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Quiz Details' }} />
    </Stack>
  )
}
