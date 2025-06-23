import { Stack } from 'expo-router';

export default function AlphabetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Alphabet Lessons' }} />
      <Stack.Screen name="[id]" options={{ title: 'Lesson' }} />
    </Stack>
  );
}