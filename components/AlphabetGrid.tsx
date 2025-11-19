import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { useGetAlphabet } from '@/api/generated/lingoStanAPI';
import type { AlphabetLetter } from '@/api/generated/models';
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
  const { data: alphabetResponse, isLoading, error } = useGetAlphabet();

  const lettersData = alphabetResponse?.data?.letters || [];

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
      {lettersData.map((item: AlphabetLetter) => {
        const isActive = activeLetter === item.id.toString();
        const isDisabled = isPlaying && !isActive;
        const isPlayed = isLetterPlayed(item.id);

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.button,
              isActive && styles.activeButton,
              isPlayed && styles.playedButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={() => playSound(item.id, item.audioUrl)}
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