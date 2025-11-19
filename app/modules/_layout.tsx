import { Stack } from 'expo-router';

export default function ModulesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]/lesson/[lessonId]" />
    </Stack>
  );
}

