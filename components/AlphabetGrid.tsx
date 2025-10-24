import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { useUserStore } from '@/store/useUserStore';

type Props = {
  setProgress: Dispatch<SetStateAction<number>>;
  setCounter: Dispatch<SetStateAction<{ total: number; progress: number }>>;
};

export default function AlphabetGrid(props: Props) {
  const { activeLang } = useUserStore();

  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedLetters, setPlayedLetters] = useState<Set<number>>(new Set());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const lettersData = activeLang?.alphabet || [];

  const { setProgress, setCounter } = props;

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    console.log(
      playedLetters.size / lettersData.length,
      playedLetters.size,
      lettersData.length
    );
    setProgress(playedLetters.size / lettersData.length);
    setCounter({
      total: lettersData.length,
      progress: playedLetters.size,
    });
  }, [playedLetters]);

  const playSound = async (letterId: number, audioUrl: any) => {
    if (isPlaying) return;

    setActiveLetter(letterId);
    setIsPlaying(true);

    try {
      const { sound } = await Audio.Sound.createAsync(
        process.env.EXPO_PUBLIC_BASE_URL + audioUrl
      );
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

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {lettersData.map((item, i) => {
        const isActive = activeLetter === i;
        const isDisabled = isPlaying && !isActive;
        const isPlayed = isLetterPlayed(i);

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.button,
              isActive && styles.activeButton,
              isPlayed && styles.playedButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={() => playSound(i, item.audioUrl)}
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
});
