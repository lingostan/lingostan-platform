import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { useLanguageControllerGetAlphabet } from '@/api/generated/lingoStanAPI';
import type { AlphabetItemDto } from '@/api/generated/models';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BaseText } from '@/components/ui/BaseText';

type Props = {
  setProgress: Dispatch<SetStateAction<number>>;
  setCounter: Dispatch<SetStateAction<{total: number, progress: number}>>;
}

export default function AlphabetGrid(props: Props) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedLetters, setPlayedLetters] = useState<Set<number>>(new Set());
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const { setProgress, setCounter } = props;
  // TODO: Нужно получить languageId из контекста или пропсов
  const languageId = 1; // Временное значение, нужно получить из контекста
  const { data: alphabetResponse, isLoading, error } = useLanguageControllerGetAlphabet(
    languageId,
    { query: { enabled: !!languageId } }
  );

  // API возвращает массив AlphabetItemDto напрямую или в data
  const lettersData = (alphabetResponse?.data as AlphabetItemDto[]) || [];

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    if (lettersData.length > 0) {
      setProgress(playedLetters.size / lettersData.length);
      setCounter({
        total: lettersData.length,
        progress: playedLetters.size
      });
    }
  }, [playedLetters, lettersData.length]);

  const playSound = async (letterId: number, audioUrl: string) => {
    if (isPlaying) return;

    setActiveLetter(letterId.toString());
    setIsPlaying(true);

    try {
      // Для локальных файлов используем require, для URL - загружаем по сети
      let audioSource;
      if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
        audioSource = { uri: audioUrl };
      } else {
        // Fallback для локальных файлов (если нужно)
        audioSource = audioUrl;
      }

      const { sound } = await Audio.Sound.createAsync(audioSource);
      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setActiveLetter(null);
          setPlayedLetters((prev) => new Set(prev).add(letterId));
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
      setIsPlaying(false);
      setActiveLetter(null);
    }
  };

  const isLetterPlayed = (letterId: number) => playedLetters.has(letterId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !lettersData.length) {
    return (
      <View style={styles.errorContainer}>
        <BaseText variant="bodyBold">{'Не удалось загрузить алфавит'}</BaseText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {lettersData.map((item: AlphabetItemDto, index: number) => {
        const itemId = index; // Используем индекс как ID, так как в AlphabetItemDto нет id
        const isActive = activeLetter === itemId.toString();
        const isDisabled = isPlaying && !isActive;
        const isPlayed = isLetterPlayed(itemId);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              isActive && styles.activeButton,
              isPlayed && styles.playedButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={() => playSound(itemId, item.audioUrl || '')}
            disabled={isDisabled}
          >
            <Text style={styles.letter}>{item.letter}</Text>
            <Text style={styles.transcription}>{item.transcription}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    width: '20%',
    aspectRatio: 1,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#ffd700',
    borderColor: '#ffaa00',
  },
  playedButton: {
    backgroundColor: '#d0f0c0',
    borderColor: '#a0e0b0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  transcription: {
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});