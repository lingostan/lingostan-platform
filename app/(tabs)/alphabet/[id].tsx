import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function AlphabetLesson() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📚 Lesson ID: {id}</Text>
    </View>
  );
}