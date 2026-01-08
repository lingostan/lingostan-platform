import { Stack } from 'expo-router';

export default function ModulesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]/lessons/[lessonId]" />
      <Stack.Screen name="[id]/lessons/[lessonId]/exercises/[exerciseId]" />
    </Stack>
  );
}

